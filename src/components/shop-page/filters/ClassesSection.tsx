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

const ClassesSection = () => {
  const { filters, toggleArrayFilter } = useFilters();
  const { products } = useProducts();

  // Get unique classes from products dynamically
  const classes = [...new Set(products.map((p: any) => p.classes).filter(Boolean))].sort();

  return (
    <Accordion type="single" collapsible defaultValue="filter-classes">
      <AccordionItem value="filter-classes" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Classes
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <div className="grid grid-cols-3 gap-3">
            {classes.map((cls, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <Checkbox
                  id={`class-${idx}`}
                  checked={filters.classes.includes(cls)}
                  onChange={() => toggleArrayFilter('classes', cls)}
                />
                <label
                  htmlFor={`class-${idx}`}
                  className="text-sm text-black/60 cursor-pointer"
                >
                  {cls}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ClassesSection;