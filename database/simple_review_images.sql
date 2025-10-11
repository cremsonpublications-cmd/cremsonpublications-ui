-- ================================================
-- SIMPLE REVIEW IMAGES ADDITION
-- ================================================
-- This only adds image support to existing reviews
-- NO existing data will be touched or removed
-- NO product table changes
-- NO complex features
-- ================================================

-- 1. Create table for review images only
CREATE TABLE IF NOT EXISTS review_images (
  id SERIAL PRIMARY KEY,
  review_id INTEGER NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Add index for better performance
CREATE INDEX IF NOT EXISTS idx_review_images_review_id ON review_images(review_id);

-- 3. Add only essential columns to existing reviews table
ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0;

-- That's it! Simple and clean.
-- All existing reviews remain untouched
-- Product table remains untouched
-- You can add your own data when needed