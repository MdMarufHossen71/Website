/*
  # Create Blog Structure with Categories

  ## Overview
  This migration sets up a complete blog system with categories and posts,
  organized for SEO-friendly URLs and content management.

  ## 1. New Tables
  
  ### `categories`
  - `id` (uuid, primary key) - Unique identifier for each category
  - `slug` (text, unique) - URL-friendly category identifier (e.g., 'digital-marketing')
  - `name` (text) - Display name for the category
  - `description` (text) - SEO description for category pages
  - `created_at` (timestamptz) - Creation timestamp
  
  ### `blog_posts`
  - `id` (uuid, primary key) - Unique identifier for each post
  - `category_id` (uuid, foreign key) - Links to categories table
  - `slug` (text, unique) - URL-friendly post identifier
  - `title` (text) - Post title
  - `excerpt` (text) - Short summary for listings
  - `content` (text) - Full post content
  - `author` (text) - Author name
  - `meta_description` (text) - SEO meta description
  - `meta_keywords` (text) - SEO keywords
  - `published_at` (timestamptz) - Publication date
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ## 2. Security
  - Enable RLS on both tables
  - Public read access for published content (non-authenticated users can view)
  - This is a public blog, so SELECT policies allow all users to read

  ## 3. Important Notes
  - Category slugs must match the folder structure: 'digital-marketing', 'graphic-design', 'freelancing'
  - Post slugs are unique across all categories
  - All timestamps use UTC
  - Public access is intentional for a public-facing blog
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text DEFAULT '',
  content text NOT NULL,
  author text DEFAULT 'MD Maruf Hossen',
  meta_description text DEFAULT '',
  meta_keywords text DEFAULT '',
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (blog is public)
CREATE POLICY "Anyone can view categories"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert the three main categories
INSERT INTO categories (slug, name, description) VALUES
  ('digital-marketing', 'Digital Marketing', 'Expert strategies and insights for successful digital marketing campaigns, SEO, social media, and online growth.'),
  ('graphic-design', 'Graphic Design', 'Creative design tips, trends, and techniques for graphic designers and visual communicators.'),
  ('freelancing', 'Freelancing', 'Practical advice for freelancers on client management, pricing, productivity, and building a successful freelance career.')
ON CONFLICT (slug) DO NOTHING;
