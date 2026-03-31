-- Supabase Database Schema for DevHub
-- Run this in Supabase SQL Editor

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  code_snippet TEXT,
  tags TEXT[] DEFAULT '{}',
  is_premium BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Messages table (for chat)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  sender_name TEXT,
  channel TEXT DEFAULT 'global',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Everyone can read, authenticated can update own
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Posts: Everyone can read, authenticated can create
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = author_id);

-- Comments: Everyone can read, authenticated can create
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Likes: Everyone can read, authenticated can manage own
CREATE POLICY "Likes are viewable by everyone" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own likes" ON likes
  FOR ALL USING (auth.uid() = user_id);

-- Messages: Everyone can read and create
CREATE POLICY "Messages are viewable by everyone" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Everyone can create messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Follows: Everyone can read, authenticated can manage
CREATE POLICY "Follows are viewable by everyone" ON follows
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own follows" ON follows
  FOR ALL USING (auth.uid() = follower_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
