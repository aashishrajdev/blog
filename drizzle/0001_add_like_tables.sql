-- Add per-user like tables and ensure uniqueness

ALTER TABLE IF EXISTS articles
  ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0 NOT NULL;

ALTER TABLE IF EXISTS comments
  ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0 NOT NULL;

CREATE TABLE IF NOT EXISTS article_likes (
  id text PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  article_id text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS article_likes_user_article_unique ON article_likes(user_id, article_id);

CREATE TABLE IF NOT EXISTS comment_likes (
  id text PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  comment_id text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS comment_likes_user_comment_unique ON comment_likes(user_id, comment_id);
