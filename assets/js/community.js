// Arcade Zone — Community & Group Chat System with Gmail Authentication

let CURRENT_USER = null;
let COMMUNITY_POSTS = [];
let COMMUNITY_GROUPS = [];
let ACTIVE_GROUP_ID = null;

// --- Authentication (Gmail / Google Account) ---
// --- Authentication (Supabase Google Auth & Profiles) ---
function initAuth() {
  syncUserFromAuth();

  // Listen to live Supabase auth changes
  window.addEventListener('arcade-auth-changed', (event) => {
    syncUserFromAuth();
  });
}

function syncUserFromAuth() {
  if (window.ArcadeAuth && window.ArcadeAuth.user) {
    const user = window.ArcadeAuth.user;
    const profile = window.ArcadeAuth.profile;
    CURRENT_USER = {
      id: user.id,
      email: user.email,
      name: profile?.display_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
      avatar: profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`,
      bio: profile?.bio || 'Arcade enthusiast in Vietnam',
      role: profile?.role || 'member',
      isSupabase: true
    };
  } else {
    const stored = localStorage.getItem('arcade_zone_user');
    if (stored) {
      try {
        CURRENT_USER = JSON.parse(stored);
      } catch(e) {
        CURRENT_USER = null;
      }
    } else {
      CURRENT_USER = null;
    }
  }
  updateAuthUI();
}

function updateAuthUI() {
  const userSlot = document.getElementById('auth-user-slot');
  if (userSlot) {
    if (CURRENT_USER) {
      userSlot.innerHTML = `
        <div class="nav-user-badge" title="${CURRENT_USER.name} (${CURRENT_USER.email})" style="cursor:pointer;">
          <img src="${CURRENT_USER.avatar}" alt="${CURRENT_USER.name}" class="nav-user-avatar" onclick="openEditProfileModal()">
          <div class="nav-user-info" onclick="openEditProfileModal()">
            <div class="nav-user-name">${CURRENT_USER.name}</div>
            <div class="nav-user-email">${CURRENT_USER.email}</div>
          </div>
          <button id="btn-signout" title="Sign out" class="nav-user-signout">&times;</button>
        </div>
      `;
      document.getElementById('btn-signout')?.addEventListener('click', (e) => {
        e.stopPropagation();
        signOut();
      });
    } else {
      userSlot.innerHTML = `
        <button class="btn btn-sm" id="btn-open-login" style="padding:6px 12px; font-size:0.72rem; display:inline-flex; align-items:center; gap:6px; white-space:nowrap;">
          <svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"/></svg>
          Sign in
        </button>
      `;
      document.getElementById('btn-open-login')?.addEventListener('click', openLoginModal);
    }
  }

  // Also update community side status banner
  const profileBanner = document.getElementById('community-user-profile');
  if (profileBanner) {
    if (CURRENT_USER) {
      profileBanner.innerHTML = `
        <div class="card" style="margin-bottom:24px; border-color:var(--cyan); background:radial-gradient(circle at 80% 20%, rgba(102,252,241,0.08), #10101e 80%);">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;">
            <div style="display:flex; align-items:center; gap:16px;">
              <img src="${CURRENT_USER.avatar}" style="width:58px; height:58px; border-radius:50%; border:2px solid var(--cyan); object-fit:cover; background:#1b1b2f;">
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <h3 style="color:#fff; font-size:1.15rem; margin-bottom:2px;">${CURRENT_USER.name}</h3>
                  <span class="tag tag-redemption" style="font-size:0.65rem;">Google Verified</span>
                  ${CURRENT_USER.role === 'admin' ? '<span class="tag tag-magenta" style="font-size:0.65rem;">Admin</span>' : ''}
                </div>
                <div style="color:var(--cyan); font-size:0.75rem; margin-bottom:4px;">${CURRENT_USER.email}</div>
                <div style="color:var(--text-dim); font-size:0.82rem; font-style:italic;">"${CURRENT_USER.bio || 'Arcade enthusiast in Vietnam'}"</div>
              </div>
            </div>
            
            <div style="display:flex; gap:8px;">
              <button class="btn btn-sm" onclick="openEditProfileModal()" style="font-size:0.72rem; padding:6px 14px;">
                Edit Profile
              </button>
              <button class="btn btn-sm" onclick="signOut()" style="border-color:var(--border); color:var(--text-dim); font-size:0.72rem; padding:6px 12px;">
                Sign out
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      profileBanner.innerHTML = `
        <div class="card" style="margin-bottom:24px; border-color:var(--magenta); background:radial-gradient(circle at 80% 20%, rgba(255,110,199,0.08), #10101e 80%); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div>
            <h3 style="color:var(--magenta); font-size:1rem; margin-bottom:4px;">Sign in with Google to Participate</h3>
            <p style="color:var(--text-dim); font-size:0.85rem; margin:0;">You can read posts freely. Sign in with Google to post tips, reply, create squads, or chat with players!</p>
          </div>
          <button class="btn btn-magenta btn-sm" onclick="openLoginModal()">Sign in with Google</button>
        </div>
      `;
    }
  }
}

function openLoginModal() {
  const warning = document.getElementById('supabase-config-warning');
  if (warning && window.ArcadeAuth) {
    warning.style.display = window.ArcadeAuth.isConfigured ? 'none' : 'block';
  }
  const modal = document.getElementById('login-modal');
  if (modal) modal.style.display = 'flex';
}

function closeLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) modal.style.display = 'none';
}

// Google OAuth Handler
async function handleGoogleSignIn() {
  if (window.ArcadeAuth) {
    await window.ArcadeAuth.signInWithGoogle();
  }
}

// Demo Account fallback (for offline or local preview without Supabase setup)
function signInWithDemo(email, name) {
  if (!email || !name) return;
  const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`;
  CURRENT_USER = {
    id: 'demo-' + Date.now(),
    email: email.trim().toLowerCase(),
    name: name.trim(),
    avatar: avatar,
    bio: 'Demo player on Arcade Zone Vietnam',
    role: 'member',
    isSupabase: false,
    joinedAt: new Date().toISOString()
  };
  localStorage.setItem('arcade_zone_user', JSON.stringify(CURRENT_USER));
  closeLoginModal();
  updateAuthUI();
  showToast(`Welcome back, ${CURRENT_USER.name}! (Demo Mode)`);
}

// Profile Modal Handlers
function openEditProfileModal() {
  if (!CURRENT_USER) {
    openLoginModal();
    return;
  }
  const emailInput = document.getElementById('edit-profile-email');
  const nameInput = document.getElementById('edit-profile-name');
  const avatarInput = document.getElementById('edit-profile-avatar');
  const bioInput = document.getElementById('edit-profile-bio');

  if (emailInput) emailInput.value = CURRENT_USER.email || '';
  if (nameInput) nameInput.value = CURRENT_USER.name || '';
  if (avatarInput) avatarInput.value = CURRENT_USER.avatar || '';
  if (bioInput) bioInput.value = CURRENT_USER.bio || '';

  const modal = document.getElementById('edit-profile-modal');
  if (modal) modal.style.display = 'flex';
}

function closeEditProfileModal() {
  const modal = document.getElementById('edit-profile-modal');
  if (modal) modal.style.display = 'none';
}

function setAvatarPreset(style) {
  const avatarInput = document.getElementById('edit-profile-avatar');
  if (avatarInput) {
    const seed = CURRENT_USER?.email || CURRENT_USER?.id || 'arcade-player';
    avatarInput.value = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
  }
}

async function saveProfileChanges() {
  const nameInput = document.getElementById('edit-profile-name');
  const avatarInput = document.getElementById('edit-profile-avatar');
  const bioInput = document.getElementById('edit-profile-bio');
  const saveBtn = document.getElementById('btn-save-profile');

  const newName = nameInput ? nameInput.value.trim() : '';
  const newAvatar = avatarInput ? avatarInput.value.trim() : '';
  const newBio = bioInput ? bioInput.value.trim() : '';

  if (!newName) {
    alert("Display Name cannot be empty.");
    return;
  }

  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";
  }

  // If connected to Supabase
  if (window.ArcadeAuth && window.ArcadeAuth.user) {
    const { error } = await window.ArcadeAuth.updateProfile({
      displayName: newName,
      avatarUrl: newAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${window.ArcadeAuth.user.id}`,
      bio: newBio
    });

    if (error) {
      alert("Error saving profile: " + error.message);
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = "Save Changes";
      }
      return;
    }
  } else if (CURRENT_USER) {
    // Local / demo fallback
    CURRENT_USER.name = newName;
    if (newAvatar) CURRENT_USER.avatar = newAvatar;
    CURRENT_USER.bio = newBio;
    localStorage.setItem('arcade_zone_user', JSON.stringify(CURRENT_USER));
    updateAuthUI();
  }

  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.textContent = "Save Changes";
  }

  closeEditProfileModal();
  showToast("Profile updated successfully!");
}

async function signOut() {
  if (window.ArcadeAuth) {
    await window.ArcadeAuth.signOut();
  }
  CURRENT_USER = null;
  localStorage.removeItem('arcade_zone_user');
  updateAuthUI();
  showToast('You have signed out.');
}

function requireAuth(callback) {
  if (CURRENT_USER) {
    callback();
  } else {
    openLoginModal();
  }
}

// Toast notification helper
function showToast(message) {
  let toast = document.getElementById('arcade-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'arcade-toast';
    toast.style.cssText = 'position:fixed; bottom:24px; right:24px; background:rgba(16,16,30,0.95); border:1px solid var(--cyan); color:#fff; padding:14px 22px; border-radius:8px; box-shadow:0 0 20px rgba(102,252,241,0.4); z-index:10000; font-family:"Orbitron",sans-serif; font-size:0.8rem; letter-spacing:1px; transition:opacity .3s;';
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 3500);
}

// --- Data Loading & Persistence (Cloud Supabase + Local Fallback) ---
async function loadCommunityData() {
  try {
    let sampleData = window.ARCADE_COMMUNITY_DATA;
    if (!sampleData) {
      try {
        const res = await fetch('data/community.json');
        sampleData = await res.json();
      } catch(e) {}
    }
    
    let dbPosts = [];
    let dbGroups = [];

    // 1. Fetch live posts from Supabase if connected
    if (window.ArcadeAuth && window.ArcadeAuth.client) {
      try {
        const { data: posts, error: pErr } = await window.ArcadeAuth.client
          .from('community_posts')
          .select(`
            id,
            author_id,
            tag,
            title,
            content,
            likes_count,
            created_at,
            author:profiles (
              id,
              display_name,
              avatar_url,
              email
            )
          `)
          .order('created_at', { ascending: false });

        if (!pErr && posts) {
          dbPosts = posts.map(p => ({
            id: p.id,
            authorId: p.author_id,
            author: p.author?.display_name || 'Arcade Gamer',
            email: p.author?.email || '',
            avatar: p.author?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${p.id}`,
            tag: p.tag,
            title: p.title,
            content: p.content,
            likes: p.likes_count || 0,
            date: new Date(p.created_at).toISOString().split('T')[0],
            comments: [],
            isDb: true
          }));
        }

        // 2. Fetch live groups from Supabase
        const { data: groups, error: gErr } = await window.ArcadeAuth.client
          .from('community_groups')
          .select(`
            id,
            name,
            category,
            description,
            avatar_icon,
            created_at,
            created_by,
            creator:profiles!created_by (
              id,
              display_name,
              avatar_url,
              email
            )
          `)
          .order('created_at', { ascending: false });

        if (!gErr && groups) {
          dbGroups = groups.map(g => {
            const isPriv = (g.avatar_icon && g.avatar_icon.startsWith('private:')) || g.is_private === true;
            const code = (g.avatar_icon && g.avatar_icon.startsWith('private:'))
              ? g.avatar_icon.split(':')[1]
              : (g.join_code || null);
            return {
              id: g.id,
              name: g.name,
              description: g.description,
              category: g.category,
              avatarIcon: '',
              memberCount: 1,
              creator: g.creator?.email || '',
              createdBy: g.created_by,
              isDb: true,
              isPrivate: isPriv,
              joinCode: code,
              messages: []
            };
          });
        }
      } catch (err) {
        console.warn('[ArcadeZone] Supabase fetch error:', err);
      }
    }

    // Combine cloud posts with sample posts
    const localPosts = JSON.parse(localStorage.getItem('arcade_zone_posts') || '[]');
    COMMUNITY_POSTS = [...dbPosts, ...localPosts, ...(sampleData ? (sampleData.posts || []) : [])];

    // Combine cloud groups with sample groups
    const localGroups = JSON.parse(localStorage.getItem('arcade_zone_groups') || '[]');
    COMMUNITY_GROUPS = [...dbGroups, ...localGroups, ...(sampleData ? (sampleData.groups || []) : [])];
  } catch(err) {
    console.error('Failed to load community data:', err);
  }
}

// --- Discussions / Forum Rendering ---
function renderDiscussions(activeTag = 'All') {
  const container = document.getElementById('discussions-feed');
  if (!container) return;

  let filtered = COMMUNITY_POSTS;
  if (activeTag !== 'All') {
    filtered = COMMUNITY_POSTS.filter(p => p.tag === activeTag);
  }

  if (!filtered.length) {
    container.innerHTML = `
      <div class="not-found">
        <h2>No discussions yet in this category</h2>
        <p>Be the first to share a tip, question, or arcade high score!</p>
        <button class="btn btn-sm" onclick="requireAuth(openCreatePostModal)">Create First Post</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(post => {
    const isMyPost = CURRENT_USER && (
      (post.authorId && CURRENT_USER.id && post.authorId === CURRENT_USER.id) ||
      (post.email && CURRENT_USER.email && post.email.toLowerCase() === CURRENT_USER.email.toLowerCase())
    );

    return `
      <article class="card reveal visible" style="margin-bottom:20px; border-color:rgba(255,255,255,0.08);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="${post.avatar}" style="width:36px; height:36px; border-radius:50%; background:#222; border:1px solid var(--cyan);">
            <div>
              <div style="font-weight:700; color:#fff; font-size:0.9rem; display:flex; align-items:center; gap:6px;">
                ${post.author}
                ${post.isDb ? '<span style="font-size:0.65rem; color:var(--cyan); background:rgba(102,252,241,0.1); padding:1px 6px; border-radius:10px; border:1px solid rgba(102,252,241,0.3);">Cloud</span>' : ''}
              </div>
              <div style="font-size:0.75rem; color:var(--text-dim);">${post.date} &bull; ${post.email || ''}</div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="tag tag-redemption">${post.tag}</span>
            ${isMyPost ? `
              <button onclick="deletePost('${post.id}')" title="Delete your post" class="btn btn-sm" style="background:transparent; border-color:var(--magenta); color:var(--magenta); font-size:0.72rem; padding:3px 8px;">
                Delete
              </button>
            ` : ''}
          </div>
        </div>

        <h3 style="font-family:'Orbitron',sans-serif; font-size:1.15rem; color:var(--cyan); margin-bottom:10px;">
          ${post.title}
        </h3>

        <p style="color:var(--text); font-size:0.92rem; line-height:1.6; margin-bottom:16px;">
          ${post.content}
        </p>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.06); padding-top:12px;">
          <div style="display:flex; gap:16px;">
            <button class="btn btn-sm btn-like" onclick="likePost('${post.id}')" style="padding:6px 14px; font-size:0.75rem;">
              Likes (${post.likes || 0})
            </button>
            <button class="btn btn-sm" onclick="toggleComments('${post.id}')" style="padding:6px 14px; font-size:0.75rem; border-color:var(--border); color:var(--text-dim);">
              Comments (${(post.comments || []).length})
            </button>
          </div>
        </div>

        <!-- Comments Container -->
        <div id="comments-${post.id}" style="display:none; margin-top:16px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.06);">
          <div class="comments-list" style="display:flex; flex-direction:column; gap:10px; margin-bottom:14px;">
            ${(post.comments || []).map(c => `
              <div style="background:var(--bg3); padding:10px 14px; border-radius:6px; font-size:0.85rem;">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                  <strong style="color:var(--cyan);">${c.author}</strong>
                  <span style="color:var(--text-dim); font-size:0.75rem;">${c.date}</span>
                </div>
                <div style="color:var(--text);">${c.content}</div>
              </div>
            `).join('')}
          </div>
          <div style="display:flex; gap:8px;">
            <input type="text" id="comment-input-${post.id}" class="search-bar" style="flex:1;" placeholder="Write a reply...">
            <button class="btn btn-sm" onclick="requireAuth(() => submitComment('${post.id}'))">Send</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function likePost(postId) {
  const p = COMMUNITY_POSTS.find(x => x.id === postId);
  if (p) {
    p.likes = (p.likes || 0) + 1;
    renderDiscussions(document.querySelector('.feed-tag-btn.active')?.dataset.tag || 'All');
  }
}

function toggleComments(postId) {
  const el = document.getElementById(`comments-${postId}`);
  if (el) {
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
  }
}

function submitComment(postId) {
  const input = document.getElementById(`comment-input-${postId}`);
  if (!input || !input.value.trim()) return;

  const p = COMMUNITY_POSTS.find(x => x.id === postId);
  if (p) {
    if (!p.comments) p.comments = [];
    p.comments.push({
      author: CURRENT_USER.name,
      email: CURRENT_USER.email,
      avatar: CURRENT_USER.avatar,
      content: input.value.trim(),
      date: new Date().toISOString().split('T')[0]
    });
    input.value = '';
    renderDiscussions(document.querySelector('.feed-tag-btn.active')?.dataset.tag || 'All');
    document.getElementById(`comments-${postId}`).style.display = 'block';
  }
}

function openCreatePostModal() {
  document.getElementById('create-post-modal').style.display = 'flex';
}

function closeCreatePostModal() {
  document.getElementById('create-post-modal').style.display = 'none';
}

async function createPost(title, tag, content) {
  if (!title || !content) return;

  // 1. Save to Supabase Cloud if user is authenticated
  if (window.ArcadeAuth && window.ArcadeAuth.user && window.ArcadeAuth.client) {
    try {
      const { data, error } = await window.ArcadeAuth.client
        .from('community_posts')
        .insert({
          author_id: window.ArcadeAuth.user.id,
          tag: tag || 'Tips & Strategy',
          title: title.trim(),
          content: content.trim()
        })
        .select(`
          id,
          author_id,
          tag,
          title,
          content,
          likes_count,
          created_at,
          author:profiles (
            id,
            display_name,
            avatar_url,
            email
          )
        `)
        .single();

      if (error) {
        alert('Lỗi khi lưu bài viết lên Cloud: ' + error.message);
        return;
      }

      const newPost = {
        id: data.id,
        authorId: data.author_id,
        author: data.author?.display_name || CURRENT_USER.name,
        email: data.author?.email || CURRENT_USER.email,
        avatar: data.author?.avatar_url || CURRENT_USER.avatar,
        tag: data.tag,
        title: data.title,
        content: data.content,
        likes: data.likes_count || 0,
        date: new Date(data.created_at).toISOString().split('T')[0],
        comments: [],
        isDb: true
      };

      COMMUNITY_POSTS.unshift(newPost);
      closeCreatePostModal();
      renderDiscussions();
      showToast('Bài viết đã được lưu lên Cloud Supabase! Mọi người đều sẽ thấy');
      return;
    } catch(err) {
      console.error('[ArcadeZone] Cloud createPost error:', err);
    }
  }

  // 2. Offline / local fallback
  const newPost = {
    id: 'post-' + Date.now(),
    author: CURRENT_USER.name,
    email: CURRENT_USER.email,
    avatar: CURRENT_USER.avatar,
    tag: tag || 'Tips & Strategy',
    title: title,
    content: content,
    likes: 0,
    date: new Date().toISOString().split('T')[0],
    comments: []
  };

  COMMUNITY_POSTS.unshift(newPost);
  const localPosts = JSON.parse(localStorage.getItem('arcade_zone_posts') || '[]');
  localPosts.unshift(newPost);
  localStorage.setItem('arcade_zone_posts', JSON.stringify(localPosts));

  closeCreatePostModal();
  renderDiscussions();
  showToast('Your post has been published to the community!');
}

async function deletePost(postId) {
  if (!confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) return;

  const post = COMMUNITY_POSTS.find(p => p.id === postId);
  if (post && post.isDb && window.ArcadeAuth && window.ArcadeAuth.client) {
    try {
      const { error } = await window.ArcadeAuth.client
        .from('community_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        alert('Không thể xóa bài viết: ' + error.message);
        return;
      }
    } catch (err) {
      console.error('[ArcadeZone] deletePost error:', err);
    }
  }

  COMMUNITY_POSTS = COMMUNITY_POSTS.filter(p => p.id !== postId);
  renderDiscussions();
  showToast('Đã xóa bài viết thành công.');
}

// --- Group Chats & Squads System (Public & Private with 6-char Code) ---
function generateJoinCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function getJoinedPrivateGroupIds() {
  try {
    return JSON.parse(localStorage.getItem('arcade_zone_joined_private_groups') || '[]');
  } catch(e) {
    return [];
  }
}

function addJoinedPrivateGroupId(groupId) {
  const list = getJoinedPrivateGroupIds();
  if (!list.includes(groupId)) {
    list.push(groupId);
    localStorage.setItem('arcade_zone_joined_private_groups', JSON.stringify(list));
  }
}

function getVisibleGroups() {
  const joinedPrivateIds = getJoinedPrivateGroupIds();
  return COMMUNITY_GROUPS.filter(g => {
    // Public squad: visible to everyone
    if (!g.isPrivate) return true;

    // Private squad: only visible if current user is creator OR has joined via code
    if (CURRENT_USER) {
      if (g.createdBy && CURRENT_USER.id && g.createdBy === CURRENT_USER.id) return true;
      if (g.creator && CURRENT_USER.email && g.creator.toLowerCase() === CURRENT_USER.email.toLowerCase()) return true;
    }
    if (joinedPrivateIds.includes(g.id)) return true;
    return false;
  });
}

function renderGroupList() {
  const container = document.getElementById('groups-list-container');
  if (!container) return;

  const visibleGroups = getVisibleGroups();

  if (!visibleGroups.length) {
    container.innerHTML = `
      <div style="padding:28px 16px; text-align:center; color:var(--text-dim); font-size:0.82rem; border:1px dashed var(--border); border-radius:8px;">
        No squads to display.<br><br>
        Create a public squad or join a private squad with your 6-character code!
      </div>
    `;
    return;
  }

  container.innerHTML = visibleGroups.map(g => {
    const isActive = g.id === ACTIVE_GROUP_ID;
    return `
      <div class="card group-card-item" onclick="selectGroup('${g.id}')" style="cursor:pointer; margin-bottom:12px; border-color:${isActive ? 'var(--cyan)' : 'rgba(255,255,255,0.08)'}; background:${isActive ? 'rgba(102,252,241,0.05)' : 'var(--bg2)'};">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <h4 style="font-family:'Orbitron',sans-serif; color:${isActive ? 'var(--cyan)' : '#fff'}; font-size:0.95rem; margin:0;">
            ${g.name}
          </h4>
          <span style="font-size:0.7rem; color:var(--text-dim);">${g.memberCount || 1} members</span>
        </div>
        <p style="color:var(--text-dim); font-size:0.8rem; margin-bottom:8px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
          ${g.description}
        </p>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="tag" style="font-size:0.65rem; border-color:var(--purple); color:var(--purple);">${g.category}</span>
          ${g.isPrivate ? `
            <span style="font-family:'Orbitron',monospace; font-size:0.65rem; color:var(--magenta); background:rgba(255,110,199,0.1); border:1px solid rgba(255,110,199,0.3); padding:2px 6px; border-radius:4px; letter-spacing:0.5px;">
              Private [${g.joinCode || 'LOCKED'}]
            </span>
          ` : `
            <span style="font-size:0.65rem; color:var(--text-dim);">Public</span>
          `}
        </div>
      </div>
    `;
  }).join('');
}

async function selectGroup(groupId) {
  ACTIVE_GROUP_ID = groupId;
  renderGroupList();
  const group = COMMUNITY_GROUPS.find(g => g.id === ACTIVE_GROUP_ID);
  if (group) {
    await loadActiveGroupMessages(group);
  }
  renderActiveChat();
}

async function loadActiveGroupMessages(group) {
  if (!group || !group.isDb || !window.ArcadeAuth || !window.ArcadeAuth.client) return;

  try {
    const { data: dbMsgs, error } = await window.ArcadeAuth.client
      .from('group_messages')
      .select(`
        id,
        message,
        created_at,
        sender:profiles (
          id,
          display_name,
          avatar_url,
          email
        )
      `)
      .eq('group_id', group.id)
      .order('created_at', { ascending: true });

    if (!error && dbMsgs) {
      group.messages = dbMsgs.map(m => {
        const d = new Date(m.created_at);
        const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        return {
          id: m.id,
          author: m.sender?.display_name || 'Arcade Gamer',
          email: m.sender?.email || '',
          avatar: m.sender?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.id}`,
          text: m.message,
          time: timeStr
        };
      });
    }
  } catch (err) {
    console.warn('[ArcadeZone] loadActiveGroupMessages error:', err);
  }
}

function renderActiveChat() {
  const chatWindow = document.getElementById('chat-window');
  if (!chatWindow) return;

  const visibleGroups = getVisibleGroups();
  const group = visibleGroups.find(g => g.id === ACTIVE_GROUP_ID) || visibleGroups[0] || COMMUNITY_GROUPS[0];
  if (!group) {
    chatWindow.innerHTML = '<div class="not-found"><h2>Select or create a squad to start chatting</h2></div>';
    return;
  }
  ACTIVE_GROUP_ID = group.id;

  chatWindow.innerHTML = `
    <!-- Chat Header -->
    <div style="padding:16px 20px; border-bottom:1px solid rgba(255,255,255,0.08); background:var(--bg3); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
      <div>
        <div style="display:flex; align-items:center; gap:8px;">
          <h3 style="font-family:'Orbitron',sans-serif; font-size:1.1rem; color:var(--cyan); margin:0;">
            ${group.name}
          </h3>
          ${group.isPrivate ? `
            <span style="font-size:0.65rem; color:var(--magenta); background:rgba(255,110,199,0.1); padding:2px 8px; border-radius:10px; border:1px solid rgba(255,110,199,0.3); font-family:'Orbitron',sans-serif;">
              Private Squad
            </span>
          ` : `
            <span style="font-size:0.65rem; color:var(--green); background:rgba(0,255,136,0.1); padding:2px 8px; border-radius:10px; border:1px solid rgba(0,255,136,0.3); font-family:'Orbitron',sans-serif;">
              Public Squad
            </span>
          `}
          ${group.isDb ? '<span style="font-size:0.65rem; color:var(--cyan); background:rgba(102,252,241,0.1); padding:2px 8px; border-radius:10px; border:1px solid rgba(102,252,241,0.3);">Cloud</span>' : ''}
        </div>
        <div style="color:var(--text-dim); font-size:0.8rem; margin-top:4px;">
          ${group.description} &bull; <span style="display:inline-block; width:7px; height:7px; background:#00ff88; border-radius:50%; margin-right:4px;"></span><span style="color:var(--green);">Active Squad</span>
        </div>
      </div>

      <!-- Right Header Actions (Invite Link removed! Code badge for private squads) -->
      <div>
        ${group.isPrivate ? `
          <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(255,110,199,0.08); border:1px solid rgba(255,110,199,0.3); padding:6px 12px; border-radius:6px;">
            <span style="font-family:'Orbitron',sans-serif; font-size:0.72rem; color:var(--text-dim);">CODE:</span>
            <span style="font-family:'Orbitron',monospace; font-size:1rem; font-weight:700; color:var(--magenta); letter-spacing:2px;">${group.joinCode || '------'}</span>
            <button class="btn btn-sm" onclick="copySquadCode('${group.joinCode}')" style="padding:4px 8px; font-size:0.65rem; margin-left:4px;" title="Copy 6-character code">
              Copy
            </button>
          </div>
        ` : ''}
      </div>
    </div>

    <!-- Messages Container -->
    <div id="chat-messages" style="flex:1; padding:20px; overflow-y:auto; max-height:480px; display:flex; flex-direction:column; gap:12px;">
      ${(group.messages || []).map(m => {
        const isMe = CURRENT_USER && (
          (m.email && CURRENT_USER.email && m.email.toLowerCase() === CURRENT_USER.email.toLowerCase())
        );
        return `
          <div style="display:flex; gap:10px; align-items:flex-start; ${isMe ? 'flex-direction:row-reverse; align-self:flex-end;' : 'align-self:flex-start;'} max-width:80%;">
            <img src="${m.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}" style="width:32px; height:32px; border-radius:50%; background:#222; flex-shrink:0; object-fit:cover;">
            <div>
              <div style="font-size:0.72rem; color:var(--text-dim); margin-bottom:2px; ${isMe ? 'text-align:right;' : ''}">
                ${m.author} &bull; <span style="font-size:0.65rem;">${m.time || ''}</span>
              </div>
              <div style="padding:10px 14px; border-radius:12px; font-size:0.88rem; line-height:1.5; ${isMe ? 'background:rgba(102,252,241,0.15); color:#fff; border:1px solid var(--cyan);' : 'background:var(--bg3); color:var(--text); border:1px solid rgba(255,255,255,0.06);'}">
                ${m.text}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Input Box -->
    <div style="padding:16px 20px; border-top:1px solid rgba(255,255,255,0.08); background:var(--bg2); display:flex; gap:12px;">
      <input type="text" id="chat-input-text" class="search-bar" style="flex:1;" placeholder="${CURRENT_USER ? 'Type your message (Enter to send)...' : 'Sign in with Google to chat...'}">
      <button class="btn btn-sm" id="btn-send-message">Send</button>
    </div>
  `;

  // Scroll to bottom
  const msgContainer = document.getElementById('chat-messages');
  if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;

  // Bind send
  const input = document.getElementById('chat-input-text');
  const btn = document.getElementById('btn-send-message');

  async function doSend() {
    requireAuth(async () => {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';

      // 1. If Cloud Group on Supabase
      if (group.isDb && window.ArcadeAuth && window.ArcadeAuth.client && window.ArcadeAuth.user) {
        try {
          const { error } = await window.ArcadeAuth.client
            .from('group_messages')
            .insert({
              group_id: group.id,
              sender_id: window.ArcadeAuth.user.id,
              message: text
            });

          if (error) {
            alert('Lỗi gửi tin nhắn: ' + error.message);
            return;
          }

          await loadActiveGroupMessages(group);
          renderActiveChat();
          return;
        } catch (err) {
          console.error('[ArcadeZone] doSend error:', err);
        }
      }

      // 2. Local fallback
      if (!group.messages) group.messages = [];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      
      group.messages.push({
        author: CURRENT_USER.name,
        email: CURRENT_USER.email,
        avatar: CURRENT_USER.avatar,
        text: text,
        time: timeStr
      });

      // Save to localStorage
      const localGroups = JSON.parse(localStorage.getItem('arcade_zone_groups') || '[]');
      const matchIdx = localGroups.findIndex(x => x.id === group.id);
      if (matchIdx >= 0) {
        localGroups[matchIdx] = group;
      } else {
        localGroups.push(group);
      }
      localStorage.setItem('arcade_zone_groups', JSON.stringify(localGroups));

      renderActiveChat();
    });
  }

  btn?.addEventListener('click', doSend);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSend();
  });
}

function copySquadCode(code) {
  if (!code) return;
  navigator.clipboard.writeText(code).then(() => {
    showToast(`Mã nhóm "${code}" đã được sao chép! Gửi cho bạn bè để vào nhóm.`);
  }).catch(() => {
    prompt('Mã nhóm của bạn:', code);
  });
}

function openCreateGroupModal() {
  document.getElementById('create-group-modal').style.display = 'flex';
}

function closeCreateGroupModal() {
  document.getElementById('create-group-modal').style.display = 'none';
}

function handlePrivacyChange(type) {
  const hint = document.getElementById('private-badge-hint');
  const labelPub = document.getElementById('label-group-public');
  const labelPriv = document.getElementById('label-group-private');
  if (type === 'private') {
    if (hint) hint.style.display = 'block';
    if (labelPriv) labelPriv.style.borderColor = 'var(--magenta)';
    if (labelPub) labelPub.style.borderColor = 'var(--border)';
  } else {
    if (hint) hint.style.display = 'none';
    if (labelPub) labelPub.style.borderColor = 'var(--cyan)';
    if (labelPriv) labelPriv.style.borderColor = 'var(--border)';
  }
}

function submitCreateGroup() {
  const name = document.getElementById('group-name')?.value.trim();
  const desc = document.getElementById('group-desc')?.value.trim();
  const cat = document.getElementById('group-cat')?.value;
  const isPrivate = document.querySelector('input[name="group-privacy-opt"]:checked')?.value === 'private';
  createGroup(name, desc, cat, isPrivate);
}

function openJoinGroupModal() {
  const modal = document.getElementById('join-group-modal');
  const input = document.getElementById('join-code-input');
  const errorEl = document.getElementById('join-code-error');
  if (input) input.value = '';
  if (errorEl) errorEl.style.display = 'none';
  if (modal) modal.style.display = 'flex';
  setTimeout(() => input?.focus(), 100);
}

function closeJoinGroupModal() {
  const modal = document.getElementById('join-group-modal');
  if (modal) modal.style.display = 'none';
}

function submitJoinGroupByCode() {
  const input = document.getElementById('join-code-input');
  if (input) {
    joinGroupByCode(input.value);
  }
}

async function joinGroupByCode(rawCode) {
  if (!rawCode) return;
  const code = rawCode.trim().toUpperCase();
  const errorEl = document.getElementById('join-code-error');
  const submitBtn = document.getElementById('btn-submit-join-code');
  if (errorEl) errorEl.style.display = 'none';

  if (code.length !== 6) {
    if (errorEl) {
      errorEl.textContent = 'Mã nhóm phải gồm đúng 6 ký tự cả chữ lẫn số.';
      errorEl.style.display = 'block';
    }
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Checking...';
  }

  let matchedGroup = null;

  // 1. Check in already loaded COMMUNITY_GROUPS
  matchedGroup = COMMUNITY_GROUPS.find(g => g.isPrivate && g.joinCode && g.joinCode.toUpperCase() === code);

  // 2. Query Supabase Cloud if connected
  if (!matchedGroup && window.ArcadeAuth && window.ArcadeAuth.client) {
    try {
      // Query by avatar_icon fallback first (format: private:CODE)
      let { data, error } = await window.ArcadeAuth.client
        .from('community_groups')
        .select(`
          id,
          name,
          category,
          description,
          avatar_icon,
          created_at,
          created_by,
          creator:profiles!created_by (
            id,
            display_name,
            avatar_url,
            email
          )
        `)
        .eq('avatar_icon', 'private:' + code)
        .maybeSingle();

      // Also try join_code column if exists
      if (!data) {
        try {
          const { data: colData } = await window.ArcadeAuth.client
            .from('community_groups')
            .select(`
              id,
              name,
              category,
              description,
              avatar_icon,
              created_at,
              created_by,
              creator:profiles!created_by (
                id,
                display_name,
                avatar_url,
                email
              )
            `)
            .eq('join_code', code)
            .maybeSingle();
          if (colData) data = colData;
        } catch(e) {}
      }

      if (data) {
        matchedGroup = {
          id: data.id,
          name: data.name,
          description: data.description,
          category: data.category,
          avatarIcon: '',
          memberCount: 1,
          creator: data.creator?.email || '',
          createdBy: data.created_by,
          isDb: true,
          isPrivate: true,
          joinCode: code,
          messages: []
        };
        if (!COMMUNITY_GROUPS.some(g => g.id === matchedGroup.id)) {
          COMMUNITY_GROUPS.unshift(matchedGroup);
        }
      }
    } catch(err) {
      console.warn('[ArcadeZone] joinGroupByCode search error:', err);
    }
  }

  // 3. Check local storage groups fallback
  if (!matchedGroup) {
    const localGroups = JSON.parse(localStorage.getItem('arcade_zone_groups') || '[]');
    const localMatch = localGroups.find(g => g.isPrivate && g.joinCode && g.joinCode.toUpperCase() === code);
    if (localMatch) {
      matchedGroup = localMatch;
      if (!COMMUNITY_GROUPS.some(g => g.id === matchedGroup.id)) {
        COMMUNITY_GROUPS.unshift(matchedGroup);
      }
    }
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Join Squad';
  }

  if (!matchedGroup) {
    if (errorEl) {
      errorEl.textContent = 'Mã nhóm không tồn tại hoặc không hợp lệ. Vui lòng kiểm tra lại.';
      errorEl.style.display = 'block';
    }
    return;
  }

  // Record membership in Supabase if logged in
  if (window.ArcadeAuth && window.ArcadeAuth.client && window.ArcadeAuth.user && matchedGroup.isDb) {
    try {
      await window.ArcadeAuth.client
        .from('group_members')
        .upsert({
          group_id: matchedGroup.id,
          user_id: window.ArcadeAuth.user.id,
          role: 'member'
        });
    } catch(e) {}
  }

  // Save to user's joined private groups
  addJoinedPrivateGroupId(matchedGroup.id);

  closeJoinGroupModal();
  renderGroupList();
  await selectGroup(matchedGroup.id);
  showToast(`Đã tham gia nhóm riêng tư "${matchedGroup.name}"!`);
}

async function createGroup(name, description, category, isPrivate = false) {
  if (!name || !description) return;

  const joinCode = isPrivate ? generateJoinCode() : null;

  // 1. Save group to Supabase Cloud if authenticated
  if (window.ArcadeAuth && window.ArcadeAuth.client && window.ArcadeAuth.user) {
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        category: category || 'General',
        created_by: window.ArcadeAuth.user.id,
        avatar_icon: isPrivate ? ('private:' + joinCode) : ''
      };

      const { data: newGrp, error } = await window.ArcadeAuth.client
        .from('community_groups')
        .insert(payload)
        .select(`
          id,
          name,
          category,
          description,
          avatar_icon,
          created_at,
          created_by,
          creator:profiles!created_by (
            id,
            display_name,
            avatar_url,
            email
          )
        `)
        .single();

      if (error) {
        alert('Lỗi khi tạo nhóm trên Cloud: ' + error.message);
        return;
      }

      if (!newGrp) return;

      // Add creator to group_members
      await window.ArcadeAuth.client.from('group_members').insert({
        group_id: newGrp.id,
        user_id: window.ArcadeAuth.user.id,
        role: 'admin'
      });

      // Add initial welcome message
      const welcomeText = isPrivate
        ? `Private squad created by ${CURRENT_USER.name}! Share the 6-character code (${joinCode}) with your teammates to let them join.`
        : `Public squad created by ${CURRENT_USER.name}! Welcome to the squad.`;

      await window.ArcadeAuth.client.from('group_messages').insert({
        group_id: newGrp.id,
        sender_id: window.ArcadeAuth.user.id,
        message: welcomeText
      });

      const formattedGrp = {
        id: newGrp.id,
        name: newGrp.name,
        description: newGrp.description,
        category: newGrp.category,
        avatarIcon: '',
        memberCount: 1,
        creator: newGrp.creator?.email || CURRENT_USER.email,
        createdBy: newGrp.created_by,
        isDb: true,
        isPrivate: isPrivate,
        joinCode: joinCode,
        messages: []
      };

      if (isPrivate) {
        addJoinedPrivateGroupId(formattedGrp.id);
      }

      COMMUNITY_GROUPS.unshift(formattedGrp);
      closeCreateGroupModal();
      await selectGroup(formattedGrp.id);
      
      if (isPrivate) {
        showToast(`Nhóm riêng tư đã tạo! Mã vào nhóm: ${joinCode}`);
      } else {
        showToast(`Nhóm "${name}" đã được lưu lên Cloud Supabase!`);
      }
      return;
    } catch (err) {
      console.error('[ArcadeZone] createGroup error:', err);
    }
  }

  // 2. Offline / local fallback
  const groupId = 'grp-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 4);
  const newGroup = {
    id: groupId,
    name: name,
    description: description,
    category: category || 'General',
    memberCount: 1,
    creator: CURRENT_USER?.email || 'Anonymous',
    isPrivate: isPrivate,
    joinCode: joinCode,
    messages: [
      {
        author: 'System',
        email: 'system@arcadezone.vn',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=system',
        text: isPrivate
          ? `Private squad created by ${CURRENT_USER?.name || 'User'}. Share the code (${joinCode}) to let friends join!`
          : `Group created by ${CURRENT_USER?.name || 'User'}. Welcome to the squad!`,
        time: 'Just now'
      }
    ]
  };

  if (isPrivate) {
    addJoinedPrivateGroupId(newGroup.id);
  }

  COMMUNITY_GROUPS.unshift(newGroup);
  const localGroups = JSON.parse(localStorage.getItem('arcade_zone_groups') || '[]');
  localGroups.unshift(newGroup);
  localStorage.setItem('arcade_zone_groups', JSON.stringify(localGroups));

  closeCreateGroupModal();
  selectGroup(groupId);
  if (isPrivate) {
    showToast(`Nhóm riêng tư "${name}" đã tạo! Mã: ${joinCode}`);
  } else {
    showToast(`Group "${name}" created successfully!`);
  }
}

// --- Init Page ---
document.addEventListener('DOMContentLoaded', async () => {
  initAuth();
  await loadCommunityData();

  // Tab switcher
  const tabBtns = document.querySelectorAll('.community-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tab = btn.dataset.tab;
      document.getElementById('tab-discussions').style.display = tab === 'discussions' ? 'block' : 'none';
      document.getElementById('tab-groups').style.display = tab === 'groups' ? 'block' : 'none';
    });
  });

  // Discussions category tags
  const feedTagBtns = document.querySelectorAll('.feed-tag-btn');
  feedTagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      feedTagBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDiscussions(btn.dataset.tag);
    });
  });

  renderDiscussions('All');

  // Select first visible squad on page load
  const visible = getVisibleGroups();
  if (visible.length > 0) {
    await selectGroup(visible[0].id);
  }

  renderGroupList();
  renderActiveChat();
});
