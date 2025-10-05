import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductListSecSkeleton = ({ title }) => {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
      <section className="max-w-frame mx-auto text-center">
        {/* Title Skeleton */}
        <div className="mb-8 md:mb-14">
          {title ? (
            <h2 className="text-[32px] md:text-5xl mb-8 md:mb-14 capitalize">
              {title}
            </h2>
          ) : (
            <Skeleton height={48} width={300} className="mx-auto" />
          )}
        </div>

        {/* Products Carousel Skeleton */}
        <div className="w-full mb-6 md:mb-9">
          <div className="mx-4 xl:mx-0 flex space-x-4 sm:space-x-5 overflow-hidden">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="w-full max-w-[198px] sm:max-w-[295px] flex-shrink-0"
              >
                {/* Product Card Skeleton */}
                <div className="space-y-3">
                  {/* Product Image */}
                  <Skeleton
                    height={200}
                    className="rounded-[13px] sm:rounded-[20px]"
                  />

                  {/* Product Title */}
                  <Skeleton height={20} width="80%" />

                  {/* Rating */}
                  <div className="flex items-center justify-start gap-2">
                    <Skeleton height={16} width={100} />
                    <Skeleton height={16} width={40} />
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <Skeleton height={24} width={80} />
                    <Skeleton height={20} width={60} />
                    <Skeleton height={18} width={40} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Button Skeleton */}
        <div className="w-full px-4 sm:px-0 text-center">
          <Skeleton
            height={48}
            width={218}
            className="rounded-full mx-auto"
          />
        </div>
      </section>
    </SkeletonTheme>
  );
};

export default ProductListSecSkeleton;