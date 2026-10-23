-- ============================================================
-- ARCADE ZONE — SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ============================================================
-- Hướng dẫn: Mở Supabase Dashboard -> Vào mục SQL Editor -> Dán toàn bộ nội dung file này và nhấn "Run".

-- 1. BẢNG HỒ SƠ THÀNH VIÊN (PROFILES)
-- Lưu thông tin thành viên sau khi đăng nhập qua Google
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT DEFAULT 'Arcade enthusiast in Vietnam 🕹️',
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Kích hoạt Row Level Security (RLS) để bảo vệ dữ liệu
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Chính sách 1: Mọi người (kể cả khách chưa đăng nhập) đều có thể xem hồ sơ công khai
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

-- Chính sách 2: Người dùng chỉ được sửa hồ sơ của chính mình, KHÔNG được tự nâng quyền role
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

-- Chính sách 3: Cho phép insert hồ sơ của chính mình
CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- TRIGGER TỰ ĐỘNG TẠO PROFILE KHI ĐĂNG NHẬP GOOGLE LẦN ĐẦU
-- Hàm này tự động chạy ngầm trên server Supabase ngay khi có user mới
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_name TEXT;
  v_avatar TEXT;
BEGIN
  -- Lấy tên hiển thị từ Google metadata
  v_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );
  
  -- Lấy ảnh đại diện từ Google metadata hoặc tạo avatar ngẫu nhiên
  v_avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id
  );

  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (NEW.id, NEW.email, v_name, v_avatar)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = timezone('utc'::text, now());
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gắn trigger vào bảng auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 2. CHUẨN BỊ SẴN CHO CÁC GIAI ĐOẠN TIẾP THEO (POSTS & GROUPS)
-- ============================================================

-- Bảng bài viết cộng đồng (Community Posts)
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  likes_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts viewable by everyone" 
  ON public.community_posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" 
  ON public.community_posts FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own posts" 
  ON public.community_posts FOR UPDATE 
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own posts" 
  ON public.community_posts FOR DELETE 
  USING (auth.uid() = author_id);


-- Bảng nhóm / squad (Community Groups)
CREATE TABLE IF NOT EXISTS public.community_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  avatar_icon TEXT DEFAULT '',
  is_private BOOLEAN NOT NULL DEFAULT false,
  join_code TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;

-- Cập nhật cột nếu bảng đã tồn tại sẵn:
ALTER TABLE public.community_groups ADD COLUMN IF NOT EXISTS is_private BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.community_groups ADD COLUMN IF NOT EXISTS join_code TEXT;

CREATE POLICY "Groups viewable by everyone" 
  ON public.community_groups FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create groups" 
  ON public.community_groups FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update own groups" 
  ON public.community_groups FOR UPDATE 
  USING (auth.uid() = created_by);


-- Bảng thành viên nhóm (Group Members)
CREATE TABLE IF NOT EXISTS public.group_members (
  group_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (group_id, user_id)
);
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members viewable by everyone" 
  ON public.group_members FOR SELECT USING (true);

CREATE POLICY "Users can join groups" 
  ON public.group_members FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups" 
  ON public.group_members FOR DELETE 
  USING (auth.uid() = user_id);


-- Bảng tin nhắn trò chuyện trong nhóm (Group Messages)
CREATE TABLE IF NOT EXISTS public.group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group messages viewable by everyone" 
  ON public.group_messages FOR SELECT USING (true);

CREATE POLICY "Authenticated users can send messages" 
  ON public.group_messages FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);
