-- ================================================
-- ENHANCED REVIEW SYSTEM DATABASE
-- ================================================
-- This file contains the complete database structure and sample data
-- for the enhanced review system with multiple image support.
--
-- SAFETY: This script is designed to be non-destructive.
-- It will not delete existing data or affect other tables.
-- ================================================

-- ================================================
-- 1. CREATE REVIEW_IMAGES TABLE
-- ================================================
-- New table for storing multiple images per review
CREATE TABLE IF NOT EXISTS review_images (
  id SERIAL PRIMARY KEY,
  review_id INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint to existing reviews table
ALTER TABLE review_images
ADD CONSTRAINT IF NOT EXISTS fk_review_images_review_id
FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_review_images_review_id ON review_images(review_id);
CREATE INDEX IF NOT EXISTS idx_review_images_created_at ON review_images(created_at);

-- ================================================
-- 2. ENHANCE EXISTING REVIEWS TABLE
-- ================================================
-- Add new optional columns without affecting existing data
ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS verified_purchase BOOLEAN DEFAULT false;

-- Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_reviews_helpful_count ON reviews(helpful_count);
CREATE INDEX IF NOT EXISTS idx_reviews_verified_purchase ON reviews(verified_purchase);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

-- ================================================
-- 3. HELPFUL TRACKING TABLE (Optional)
-- ================================================
-- Track who marked reviews as helpful to prevent duplicate clicks
CREATE TABLE IF NOT EXISTS review_helpful_tracking (
  id SERIAL PRIMARY KEY,
  review_id INTEGER NOT NULL,
  user_identifier TEXT NOT NULL, -- IP address, user_id, or session
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT fk_helpful_tracking_review_id
    FOREIGN KEY (review_id)
    REFERENCES reviews(id)
    ON DELETE CASCADE,

  -- Prevent duplicate helpful marks from same user
  UNIQUE(review_id, user_identifier)
);

CREATE INDEX IF NOT EXISTS idx_helpful_tracking_review_id ON review_helpful_tracking(review_id);

-- ================================================
-- 4. UPDATE EXISTING REVIEWS WITH DEFAULTS
-- ================================================
-- Safely add default values to existing reviews
UPDATE reviews
SET helpful_count = 0
WHERE helpful_count IS NULL;

UPDATE reviews
SET verified_purchase = false
WHERE verified_purchase IS NULL;

-- ================================================
-- 5. CREATE USEFUL VIEWS
-- ================================================

-- View that combines reviews with their images
CREATE OR REPLACE VIEW reviews_with_images AS
SELECT
  r.id,
  r.product_id,
  r.user_name,
  r.user_email,
  r.rating,
  r.title,
  r.comment,
  r.helpful_count,
  r.verified_purchase,
  r.created_at,
  r.updated_at,
  COALESCE(
    json_agg(
      json_build_object(
        'id', ri.id,
        'image_url', ri.image_url,
        'caption', ri.caption,
        'created_at', ri.created_at
      ) ORDER BY ri.created_at
    ) FILTER (WHERE ri.id IS NOT NULL),
    '[]'::json
  ) as review_images,
  COUNT(ri.id) as image_count
FROM reviews r
LEFT JOIN review_images ri ON r.id = ri.review_id
GROUP BY r.id, r.product_id, r.user_name, r.user_email, r.rating,
         r.title, r.comment, r.helpful_count, r.verified_purchase,
         r.created_at, r.updated_at;

-- View for admin statistics
CREATE OR REPLACE VIEW review_statistics AS
SELECT
  COUNT(*) as total_reviews,
  AVG(rating)::DECIMAL(3,2) as average_rating,
  COUNT(*) FILTER (WHERE verified_purchase = true) as verified_reviews,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as recent_reviews,
  COUNT(*) FILTER (WHERE rating = 5) as five_star_reviews,
  COUNT(*) FILTER (WHERE rating = 4) as four_star_reviews,
  COUNT(*) FILTER (WHERE rating = 3) as three_star_reviews,
  COUNT(*) FILTER (WHERE rating = 2) as two_star_reviews,
  COUNT(*) FILTER (WHERE rating = 1) as one_star_reviews,
  COUNT(DISTINCT ri.review_id) as reviews_with_images,
  COUNT(ri.id) as total_images
FROM reviews r
LEFT JOIN review_images ri ON r.id = ri.review_id;

-- ================================================
-- 6. SAMPLE DATA (Optional - for testing)
-- ================================================

-- Only insert sample data if the reviews table is empty or very small
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM reviews) < 5 THEN

    -- Sample reviews for testing (adjust product_ids as needed)
    INSERT INTO reviews (product_id, user_name, user_email, rating, title, comment, helpful_count, verified_purchase, created_at) VALUES
    (1, 'Rajesh Kumar', 'rajesh@example.com', 5, 'Excellent book for Class 12 Physics', 'This book helped me understand complex physics concepts easily. The diagrams are clear and examples are well explained. Highly recommended for CBSE students.', 15, true, NOW() - INTERVAL '10 days'),
    (1, 'Priya Sharma', 'priya@example.com', 4, 'Good content but could be better organized', 'The content is comprehensive but I wish the chapters were better organized. Still a valuable resource for exam preparation.', 8, true, NOW() - INTERVAL '5 days'),
    (2, 'Amit Singh', 'amit@example.com', 5, 'Perfect for competitive exams', 'This chemistry book covers all important topics for JEE and NEET. The practice questions are especially helpful.', 22, true, NOW() - INTERVAL '15 days'),
    (2, 'Sneha Patel', NULL, 4, 'Great explanations', 'Very detailed explanations with good examples. My daughter found it very helpful for her board exams.', 5, false, NOW() - INTERVAL '3 days'),
    (3, 'Vikram Reddy', 'vikram@example.com', 3, 'Average book', 'The book is okay but nothing extraordinary. Some topics could be explained better.', 2, true, NOW() - INTERVAL '20 days'),
    (3, 'Anita Gupta', 'anita@example.com', 5, 'Must-have for Class 11 Math', 'Excellent book with step-by-step solutions. My son improved his grades significantly after using this book.', 18, true, NOW() - INTERVAL '12 days'),
    (4, 'Ravi Mehta', NULL, 4, 'Good for practice', 'Lots of practice questions and mock tests. Helped me prepare well for my exams.', 7, false, NOW() - INTERVAL '8 days'),
    (4, 'Kavya Iyer', 'kavya@example.com', 5, 'Outstanding quality', 'The book quality is excellent and the content is very comprehensive. Worth every penny!', 12, true, NOW() - INTERVAL '6 days');

    -- Sample review images (using placeholder URLs - replace with actual image URLs)
    INSERT INTO review_images (review_id, image_url, caption, created_at) VALUES
    (1, 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Physics+Book+Page+1', 'Chapter on Mechanics - very clear diagrams', NOW() - INTERVAL '10 days'),
    (1, 'https://via.placeholder.com/400x300/7C3AED/FFFFFF?text=Physics+Book+Page+2', 'Solved examples are really helpful', NOW() - INTERVAL '10 days'),
    (1, 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Physics+Book+Page+3', 'Practice questions at the end', NOW() - INTERVAL '10 days'),

    (3, 'https://via.placeholder.com/400x300/DC2626/FFFFFF?text=Chemistry+Lab+Setup', 'Lab manual section with clear instructions', NOW() - INTERVAL '15 days'),
    (3, 'https://via.placeholder.com/400x300/EA580C/FFFFFF?text=Chemistry+Equations', 'Chemical equations are well formatted', NOW() - INTERVAL '15 days'),

    (6, 'https://via.placeholder.com/400x300/0891B2/FFFFFF?text=Math+Solutions', 'Step by step solutions', NOW() - INTERVAL '12 days'),
    (6, 'https://via.placeholder.com/400x300/BE185D/FFFFFF?text=Math+Graphs', 'Graphs and charts are very clear', NOW() - INTERVAL '12 days'),
    (6, 'https://via.placeholder.com/400x300/7C2D12/FFFFFF?text=Math+Practice', 'Practice exercises', NOW() - INTERVAL '12 days'),
    (6, 'https://via.placeholder.com/400x300/365314/FFFFFF?text=Math+Tips', 'Helpful tips and tricks', NOW() - INTERVAL '12 days'),

    (8, 'https://via.placeholder.com/400x300/1E40AF/FFFFFF?text=Book+Cover', 'Excellent book cover design', NOW() - INTERVAL '6 days'),
    (8, 'https://via.placeholder.com/400x300/9333EA/FFFFFF?text=Table+Contents', 'Well organized table of contents', NOW() - INTERVAL '6 days');

    -- Sample helpful tracking data
    INSERT INTO review_helpful_tracking (review_id, user_identifier) VALUES
    (1, '192.168.1.100'), (1, '192.168.1.101'), (1, '192.168.1.102'),
    (3, '192.168.1.103'), (3, '192.168.1.104'),
    (6, '192.168.1.105'), (6, '192.168.1.106'), (6, '192.168.1.107');

    RAISE NOTICE 'Sample review data inserted successfully!';
  ELSE
    RAISE NOTICE 'Sample data not inserted - reviews table already contains data.';
  END IF;
END
$$;

-- ================================================
-- 7. USEFUL FUNCTIONS
-- ================================================

-- Function to get review statistics for a specific product
CREATE OR REPLACE FUNCTION get_product_review_stats(product_id_param INTEGER)
RETURNS TABLE (
  total_reviews BIGINT,
  average_rating DECIMAL(3,2),
  five_star BIGINT,
  four_star BIGINT,
  three_star BIGINT,
  two_star BIGINT,
  one_star BIGINT,
  reviews_with_images BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_reviews,
    AVG(r.rating)::DECIMAL(3,2) as average_rating,
    COUNT(*) FILTER (WHERE r.rating = 5) as five_star,
    COUNT(*) FILTER (WHERE r.rating = 4) as four_star,
    COUNT(*) FILTER (WHERE r.rating = 3) as three_star,
    COUNT(*) FILTER (WHERE r.rating = 2) as two_star,
    COUNT(*) FILTER (WHERE r.rating = 1) as one_star,
    COUNT(DISTINCT ri.review_id) as reviews_with_images
  FROM reviews r
  LEFT JOIN review_images ri ON r.id = ri.review_id
  WHERE r.product_id = product_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to increment helpful count safely
CREATE OR REPLACE FUNCTION mark_review_helpful(review_id_param INTEGER, user_identifier_param TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  already_marked BOOLEAN := FALSE;
BEGIN
  -- Check if user already marked this review as helpful
  SELECT EXISTS(
    SELECT 1 FROM review_helpful_tracking
    WHERE review_id = review_id_param AND user_identifier = user_identifier_param
  ) INTO already_marked;

  IF already_marked THEN
    RETURN FALSE; -- User already marked this review
  END IF;

  -- Insert tracking record
  INSERT INTO review_helpful_tracking (review_id, user_identifier)
  VALUES (review_id_param, user_identifier_param);

  -- Increment helpful count
  UPDATE reviews
  SET helpful_count = helpful_count + 1
  WHERE id = review_id_param;

  RETURN TRUE; -- Successfully marked as helpful
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- 8. STORAGE BUCKET SETUP (For Supabase)
-- ================================================

-- Note: These commands should be run in your Supabase dashboard
-- or through the Supabase client, not directly in PostgreSQL

/*
-- Create storage bucket for review images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-images',
  'review-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Storage policies for review images
CREATE POLICY "Review images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'review-images');

CREATE POLICY "Anyone can upload review images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'review-images' AND
  (storage.foldername(name))[1] = 'review-images'
);

CREATE POLICY "Users can delete review images" ON storage.objects
FOR DELETE USING (bucket_id = 'review-images');
*/

-- ================================================
-- 9. VERIFICATION QUERIES
-- ================================================

-- Check that everything was created successfully
SELECT
  'reviews' as table_name,
  COUNT(*) as record_count,
  MAX(created_at) as latest_record
FROM reviews
UNION ALL
SELECT
  'review_images' as table_name,
  COUNT(*) as record_count,
  MAX(created_at) as latest_record
FROM review_images
UNION ALL
SELECT
  'review_helpful_tracking' as table_name,
  COUNT(*) as record_count,
  MAX(created_at) as latest_record
FROM review_helpful_tracking;

-- Test the statistics view
SELECT * FROM review_statistics;

-- Test the function
SELECT * FROM get_product_review_stats(1);

-- ================================================
-- 10. CLEANUP COMMANDS (Use with caution)
-- ================================================

/*
-- Uncomment these only if you need to remove the new review system
-- WARNING: This will delete all review images and related data

-- DROP VIEW IF EXISTS reviews_with_images CASCADE;
-- DROP VIEW IF EXISTS review_statistics CASCADE;
-- DROP FUNCTION IF EXISTS get_product_review_stats(INTEGER) CASCADE;
-- DROP FUNCTION IF EXISTS mark_review_helpful(INTEGER, TEXT) CASCADE;
-- DROP TABLE IF EXISTS review_helpful_tracking CASCADE;
-- DROP TABLE IF EXISTS review_images CASCADE;

-- Remove added columns from reviews table (be very careful with this)
-- ALTER TABLE reviews
-- DROP COLUMN IF EXISTS title,
-- DROP COLUMN IF EXISTS helpful_count,
-- DROP COLUMN IF EXISTS verified_purchase;
*/

-- ================================================
-- END OF ENHANCED REVIEW SYSTEM DATABASE
-- ================================================

RAISE NOTICE '========================================';
RAISE NOTICE 'Enhanced Review System Setup Complete!';
RAISE NOTICE '========================================';
RAISE NOTICE 'Tables created: review_images, review_helpful_tracking';
RAISE NOTICE 'Views created: reviews_with_images, review_statistics';
RAISE NOTICE 'Functions created: get_product_review_stats, mark_review_helpful';
RAISE NOTICE 'New columns added to reviews: title, helpful_count, verified_purchase';
RAISE NOTICE '========================================';
RAISE NOTICE 'All existing review data is preserved and functional!';
RAISE NOTICE '========================================';