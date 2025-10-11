import React from 'react';
import ReviewsSection from '../reviews/ReviewsSection';

const ProductReviews = ({ productId }) => {
  return <ReviewsSection productId={productId} className="mt-8" />;
};

export default ProductReviews;
