import React from "react";
import * as motion from "framer-motion/client";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";

const ProductListSec = ({ title, data, viewAllLink }) => {
  return (
    <section className="max-w-frame mx-auto text-center">
      <motion.h2
        initial={{ y: "100px", opacity: 0 }}
        whileInView={{ y: "0", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.1 }}
        className={cn([
          integralCF.className,
          "text-[32px] md:text-5xl mb-8 md:mb-14 capitalize",
        ])}
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ y: "100px", opacity: 0 }}
        whileInView={{ y: "0", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {data && data.length > 0 ? (
          <>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full mb-6 md:mb-9"
            >
              <CarouselContent className="mx-4 xl:mx-0 space-x-4 sm:space-x-5">
                {data.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="w-full max-w-[198px] sm:max-w-[295px] pl-0"
                  >
                    <ProductCard data={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            {viewAllLink && (
              <div className="w-full px-4 sm:px-0 text-center">
                <Link
                  to={viewAllLink}
                  className="w-full inline-block sm:w-[218px] px-[54px] py-4 border rounded-full hover:bg-black hover:text-white text-black transition-all font-medium text-sm sm:text-base border-black/10"
                >
                  View All
                </Link>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No books available yet
            </h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              We're currently updating our collection. New educational books and study materials will be available soon!
            </p>
            {viewAllLink && (
              <Link
                to={viewAllLink}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-full transition-colors font-medium"
              >
                Explore All Categories
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ProductListSec;
