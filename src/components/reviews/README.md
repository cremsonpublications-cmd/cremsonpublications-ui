# Enhanced Review System

## Overview
This enhanced review system adds support for multiple image uploads while maintaining compatibility with existing review functionality.

## Features
- ✅ Multiple image uploads (max 5 images, 5MB each)
- ✅ Enhanced review display with image gallery
- ✅ Admin panel for review management
- ✅ Filtering and sorting capabilities
- ✅ Fully isolated from existing product/category systems

## Components

### 1. ReviewForm.jsx
Enhanced form component with image upload functionality:
- Supports multiple image uploads
- Image validation (type, size)
- Image previews before submission
- Form validation with error handling

### 2. EnhancedReviewCard.jsx
Enhanced review display component:
- Shows multiple review images in a grid
- Lightbox/gallery view for images
- Helpful button functionality
- Admin-specific features

### 3. ReviewsSection.jsx
Complete reviews section for product pages:
- Integrates form and display components
- Rating breakdown visualization
- Filtering and sorting options
- Loading states and empty states

### 4. ReviewsManagement.jsx (Admin)
Admin panel component for managing reviews:
- Statistics dashboard
- Advanced filtering options
- Review moderation capabilities
- Pagination support

## Database Schema Requirements

### review_images table
```sql
CREATE TABLE review_images (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Storage bucket
- Create a 'review-images' storage bucket in Supabase
- Configure appropriate permissions for image uploads

## Integration Guide

### 1. Product Page Integration
Replace existing review section with:
```jsx
import ReviewsSection from '../components/reviews/ReviewsSection';

// In your product page component
<ReviewsSection productId={product.id} className="mt-8" />
```

### 2. Admin Panel Integration
Add reviews management tab:
```jsx
import ReviewsManagement from '../components/admin/ReviewsManagement';

// In your admin dashboard
<ReviewsManagement />
```

### 3. API Integration
The enhanced reviewsApi is backward compatible:
- Existing review endpoints work unchanged
- New image upload functionality is optional
- Admin functions are in separate namespace (reviewsApi.admin)

## Backward Compatibility
- ✅ Existing reviews display normally (no images)
- ✅ Old review submission still works
- ✅ No changes needed to existing product/category code
- ✅ Gradual migration - can use old and new components side by side

## File Structure
```
src/components/reviews/
├── ReviewForm.jsx              # New review form with images
├── EnhancedReviewCard.jsx      # Enhanced review display
├── ReviewsSection.jsx          # Complete reviews section
└── README.md                   # This file

src/components/admin/
└── ReviewsManagement.jsx       # Admin review management

src/services/
└── reviewApi.js                # Enhanced API (backward compatible)

src/types/
└── review.types.ts             # Updated type definitions
```

## Usage Examples

### Basic Product Page
```jsx
<ReviewsSection productId={productId} />
```

### Admin Dashboard
```jsx
<ReviewsManagement />
```

### Custom Integration
```jsx
import ReviewForm from './components/reviews/ReviewForm';
import EnhancedReviewCard from './components/reviews/EnhancedReviewCard';

// Use components individually as needed
```

## Security Considerations
- Image uploads are validated on client-side
- Server-side validation should be implemented in Supabase
- Image storage permissions should be configured properly
- File size and type restrictions are enforced

## Performance Notes
- Images are lazy-loaded in gallery view
- Pagination is implemented for admin panel
- Image previews are generated on client-side
- Storage cleanup is handled automatically when reviews are deleted