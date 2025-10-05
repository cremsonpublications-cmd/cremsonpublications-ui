import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilters } from "../../../context/FilterContext";
import { useProducts } from "../../../context/ProductContext";

const CategoriesSection = () => {
  const { filters, toggleArrayFilter } = useFilters();
  const { products } = useProducts();

  // Get unique categories from products dynamically
  const categories = [...new Set(products.map((p: any) => p.categories?.name).filter(Boolean))].sort();

  return (
    <Accordion type="single" collapsible defaultValue="categories">
      <AccordionItem value="categories" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Categories
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <div className="space-y-3">
            {categories.map((category, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${idx}`}
                  checked={filters.categories.includes(category)}
                  onChange={() => toggleArrayFilter('categories', category)}
                />
                <label
                  htmlFor={`category-${idx}`}
                  className="text-sm text-black/60 cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CategoriesSection;
