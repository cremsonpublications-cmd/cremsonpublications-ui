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

const SubCategoriesSection = () => {
  const { filters, toggleArrayFilter } = useFilters();
  const { products } = useProducts();

  // Get unique sub-categories from products dynamically - flatten arrays
  const allSubCategories = products.flatMap((p: any) => p.sub_categories || []);
  const subCategories = [...new Set(allSubCategories)].filter(Boolean).sort();

  if (subCategories.length === 0) return null;

  return (
    <Accordion type="single" collapsible defaultValue="sub-categories">
      <AccordionItem value="sub-categories" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Sub Categories
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <div className="space-y-3">
            {subCategories.map((subCategory, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <Checkbox
                  id={`sub-category-${idx}`}
                  checked={filters.sub_categories.includes(subCategory)}
                  onChange={() => toggleArrayFilter('sub_categories', subCategory)}
                />
                <label
                  htmlFor={`sub-category-${idx}`}
                  className="text-sm text-black/60 cursor-pointer"
                >
                  {subCategory}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SubCategoriesSection;
