import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductPageSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />

        {/* Breadcrumb Skeleton */}
        <div className="mb-11">
          <Skeleton height={20} width={300} />
        </div>

        {/* Main Product Section */}
        <section className="mb-11">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Image Section Skeleton */}
            <div>
              {/* Main Image */}
              <div className="flex flex-col space-y-3">
                <Skeleton height={400} className="rounded-[13px]" />

                {/* Thumbnail Images */}
                <div className="flex space-x-3">
                  <Skeleton height={80} width={80} className="rounded-md" />
                  <Skeleton height={80} width={80} className="rounded-md" />
                  <Skeleton height={80} width={80} className="rounded-md" />
                  <Skeleton height={80} width={80} className="rounded-md" />
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div>
              {/* Product Title */}
              <Skeleton height={40} width="80%" className="mb-3" />

              {/* Author and Book Details */}
              <div className="mb-4">
                <Skeleton height={20} width="60%" className="mb-1" />
                <div className="flex flex-wrap gap-4">
                  <Skeleton height={16} width={100} />
                  <Skeleton height={16} width={120} />
                  <Skeleton height={16} width={80} />
                  <Skeleton height={16} width={140} />
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-3">
                <Skeleton height={25} width={150} />
                <Skeleton height={16} width={60} className="ml-3" />
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <Skeleton height={32} width={100} className="rounded-full" />
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-5">
                <Skeleton height={32} width={100} />
                <Skeleton height={32} width={120} />
                <Skeleton height={24} width={60} />
              </div>

              {/* Description */}
              <div className="mb-5">
                <Skeleton height={16} width="100%" />
                <Skeleton height={16} width="90%" />
                <Skeleton height={16} width="85%" />
              </div>

              {/* Bulk Pricing */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton height={20} width={20} />
                  <Skeleton height={24} width={120} />
                  <Skeleton height={16} width={150} />
                </div>
                <div className="flex gap-2">
                  <Skeleton height={80} width={150} className="rounded-md" />
                  <Skeleton height={80} width={150} className="rounded-md" />
                </div>
              </div>

              <hr className="h-[1px] border-t-black/10 mb-5" />

              {/* Add to Cart Section */}
              <div className="flex items-center justify-center mb-8">
                <Skeleton height={52} width={120} className="rounded-full" />
                <Skeleton height={52} width={200} className="rounded-full ml-5" />
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Skeleton height={40} width={150} />
                  <Skeleton height={40} width={150} />
                </div>

                <Skeleton height={20} width={250} />

                <div className="flex items-center gap-4">
                  <Skeleton height={20} width={20} />
                  <Skeleton height={20} width={60} />
                  <div className="flex gap-3">
                    <Skeleton height={36} width={36} className="rounded-full" />
                    <Skeleton height={36} width={36} className="rounded-full" />
                    <Skeleton height={36} width={36} className="rounded-full" />
                    <Skeleton height={36} width={36} className="rounded-full" />
                    <Skeleton height={36} width={36} className="rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products Section */}
        <div className="mb-20">
          <Skeleton height={32} width={200} className="mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="space-y-3">
                <Skeleton height={200} className="rounded-lg" />
                <Skeleton height={20} width="80%" />
                <Skeleton height={16} width="60%" />
                <Skeleton height={24} width="70%" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default ProductPageSkeleton;