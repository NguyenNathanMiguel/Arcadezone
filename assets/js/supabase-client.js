// ============================================================
// ARCADE ZONE — SUPABASE CLIENT & AUTH HELPER
// ============================================================

(function () {
  const config = window.ARCADE_SUPABASE_CONFIG || {};
  const rawUrl = (config.url || "").trim();
  const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const isConfigured = Boolean(
    cleanUrl &&
    config.anonKey &&
    !cleanUrl.includes("YOUR_SUPABASE_PROJECT_URL") &&
    !config.anonKey.includes("YOUR_SUPABASE_ANON_KEY")
  );

  let client = null;
  if (isConfigured && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      client = window.supabase.createClient(cleanUrl, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    } catch (err) {
      console.error("[ArcadeZone] Failed to initialize Supabase client:", err);
    }
  }

  // Global Auth State
  const ArcadeAuth = {
    isConfigured: isConfigured,
    client: client,
    user: null,
    profile: null,
    isLoading: true,

    // Kiểm tra cấu hình và hiển thị thông báo nếu chưa cấu hình
    checkConfig: function () {
      if (!this.isConfigured) {
        console.warn("[ArcadeZone] Supabase chưa được cấu hình. Vui lòng cập nhật assets/js/supabase-config.js.");
        return false;
      }
      return true;
    },

    // Đăng nhập bằng Google OAuth
    signInWithGoogle: async function () {
      if (!this.checkConfig()) {
        alert("⚠️ Vui lòng cấu hình Supabase URL và Anon Key trong file 'assets/js/supabase-config.js' trước khi đăng nhập!");
        return { error: new Error("Supabase is not configured yet") };
      }

      // Google OAuth không hỗ trợ giao thức file:///
      if (window.location.protocol === 'file:') {
        alert("⚠️ Google OAuth yêu cầu chạy trên máy chủ web (như http://localhost:3000 hoặc trên Netlify), không thể chạy trực tiếp qua file:///.\n\nBạn hãy mở thư mục bằng VS Code Live Server hoặc deploy lên Netlify nhé!");
        return { error: new Error("file:// protocol not supported by Google OAuth") };
      }

      // URL chuyển hướng về sau khi Google xác thực thành công
      // Giữ nguyên trang hiện tại hoặc trang community.html
      const currentPath = window.location.pathname;
      const redirectPath = currentPath.endsWith('/') ? currentPath + 'community.html' : currentPath;
      const redirectTo = window.location.origin + redirectPath;

      const { data, error } = await this.client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        console.error("[ArcadeZone] Google Login error:", error);
        alert("Đăng nhập thất bại: " + error.message);
      }
      return { data, error };
    },

    // Đăng xuất
    signOut: async function () {
      if (this.client) {
        await this.client.auth.signOut();
      }
      this.user = null;
      this.profile = null;
      localStorage.removeItem('arcade_zone_user');
      this.notifyStateChange();
    },

    // Lấy hồ sơ từ bảng public.profiles trong Supabase
    fetchProfile: async function (userId) {
      if (!this.client || !userId) return null;
      try {
        const { data, error } = await this.client
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.warn("[ArcadeZone] Error fetching profile:", error);
        }
        return data || null;
      } catch (err) {
        console.error("[ArcadeZone] fetchProfile failed:", err);
        return null;
      }
    },

    // Tự động tạo hoặc đồng bộ hồ sơ dự phòng nếu database trigger chưa chạy
    syncProfile: async function (authUser) {
      if (!this.client || !authUser) return null;
      try {
        let profile = await this.fetchProfile(authUser.id);
        if (!profile) {
          const meta = authUser.user_metadata || {};
          const fallbackName = meta.full_name || meta.name || authUser.email.split('@')[0];
          const fallbackAvatar = meta.avatar_url || meta.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${authUser.id}`;

          const { data, error } = await this.client
            .from('profiles')
            .upsert({
              id: authUser.id,
              email: authUser.email,
              display_name: fallbackName,
              avatar_url: fallbackAvatar
            })
            .select()
            .single();

          if (!error && data) {
            profile = data;
          }
        }
        return profile;
      } catch (err) {
        console.error("[ArcadeZone] syncProfile failed:", err);
        return null;
      }
    },

    // Cập nhật thông tin hồ sơ của chính mình (Display name, Avatar, Bio)
    updateProfile: async function ({ displayName, avatarUrl, bio }) {
      if (!this.client || !this.user) {
        return { error: new Error("User not authenticated") };
      }

      const updates = {
        updated_at: new Date().toISOString()
      };
      if (typeof displayName === 'string' && displayName.trim()) {
        updates.display_name = displayName.trim();
      }
      if (typeof avatarUrl === 'string' && avatarUrl.trim()) {
        updates.avatar_url = avatarUrl.trim();
      }
      if (typeof bio === 'string') {
        updates.bio = bio.trim();
      }

      try {
        const { data, error } = await this.client
          .from('profiles')
          .update(updates)
          .eq('id', this.user.id)
          .select()
          .single();

        if (!error && data) {
          this.profile = data;
          this.syncToLocalStorage();
          this.notifyStateChange();
          return { data, error: null };
        }
        return { data: null, error };
      } catch (err) {
        return { data: null, error: err };
      }
    },

    // Đồng bộ vào localStorage để tương thích với các trang khác khi load offline
    syncToLocalStorage: function () {
      if (this.user) {
        const cached = {
          id: this.user.id,
          email: this.user.email,
          name: this.profile?.display_name || this.user.user_metadata?.full_name || this.user.email.split('@')[0],
          avatar: this.profile?.avatar_url || this.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${this.user.id}`,
          bio: this.profile?.bio || '',
          role: this.profile?.role || 'member',
          isSupabaseAuth: true
        };
        localStorage.setItem('arcade_zone_user', JSON.stringify(cached));
      } else {
        localStorage.removeItem('arcade_zone_user');
      }
    },

    // Thông báo cho giao diện (Navbar, Trang Community) khi trạng thái thay đổi
    notifyStateChange: function () {
      window.dispatchEvent(new CustomEvent('arcade-auth-changed', {
        detail: {
          user: this.user,
          profile: this.profile,
          isConfigured: this.isConfigured
        }
      }));
    },

    // Khởi tạo phiên làm việc ban đầu
    init: async function () {
      if (!this.client) {
        this.isLoading = false;
        this.notifyStateChange();
        return;
      }

      try {
        // Lấy session hiện tại
        const { data: { session } } = await this.client.auth.getSession();
        if (session && session.user) {
          this.user = session.user;
          this.profile = await this.syncProfile(session.user);
          this.syncToLocalStorage();
        } else {
          this.user = null;
          this.profile = null;
          localStorage.removeItem('arcade_zone_user');
        }
      } catch (err) {
        console.warn("[ArcadeZone] Session check error:", err);
      } finally {
        this.isLoading = false;
        this.notifyStateChange();
      }

      // Lắng nghe sự kiện đăng nhập / đăng xuất tự động
      this.client.auth.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
          this.user = session.user;
          this.profile = await this.syncProfile(session.user);
          this.syncToLocalStorage();
        } else {
          this.user = null;
          this.profile = null;
          localStorage.removeItem('arcade_zone_user');
        }
        this.notifyStateChange();
      });
    }
  };

  // Gán vào global window
  window.ArcadeAuth = ArcadeAuth;

  // Tự động khởi động khi trang load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ArcadeAuth.init());
  } else {
    ArcadeAuth.init();
  }
})();
