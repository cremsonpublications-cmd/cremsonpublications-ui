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

const EditionSection = () => {
  const { filters, toggleArrayFilter } = useFilters();
  const { products } = useProducts();

  // Get unique editions from products dynamically
  const editions = [...new Set(products.map((p: any) => p.edition).filter(Boolean))].sort();

  if (editions.length === 0) return null;

  return (
    <Accordion type="single" collapsible defaultValue="editions">
      <AccordionItem value="editions" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Edition
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <div className="space-y-3">
            {editions.map((edition, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <Checkbox
                  id={`edition-${idx}`}
                  checked={filters.editions.includes(edition)}
                  onChange={() => toggleArrayFilter('editions', edition)}
                />
                <label
                  htmlFor={`edition-${idx}`}
                  className="text-sm text-black/60 cursor-pointer"
                >
                  {edition}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default EditionSection;
