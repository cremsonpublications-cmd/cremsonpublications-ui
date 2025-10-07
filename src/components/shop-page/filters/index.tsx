import React from "react";
import CategoriesSection from "@/components/shop-page/filters/CategoriesSection";
import SubCategoriesSection from "@/components/shop-page/filters/SubCategoriesSection";
import AuthorSection from "@/components/shop-page/filters/AuthorSection";
import ClassesSection from "@/components/shop-page/filters/ClassesSection";
import EditionSection from "@/components/shop-page/filters/EditionSection";
import PriceSection from "@/components/shop-page/filters/PriceSection";
import StatusSection from "@/components/shop-page/filters/StatusSection";
import { Button } from "@/components/ui/button";
import { useFilters } from "../../../context/FilterContext";

const Filters = () => {
  const { clearFilters, hasActiveFilters } = useFilters();

  return (
    <>
      <hr className="border-t-black/10" />
      <CategoriesSection />
      <hr className="border-t-black/10" />
      <SubCategoriesSection />
      <hr className="border-t-black/10" />
      <AuthorSection />
      <hr className="border-t-black/10" />
      <ClassesSection />
      <hr className="border-t-black/10" />
      <EditionSection />
      <hr className="border-t-black/10" />
      <PriceSection />
      <hr className="border-t-black/10" />
      <StatusSection />
      {hasActiveFilters && (
        <Button
          type="button"
          onClick={clearFilters}
          variant="outline"
          className="w-full rounded-full text-sm font-medium py-4 h-12 mb-3"
        >
          Clear All Filters
        </Button>
      )}
    </>
  );
};

export default Filters;
