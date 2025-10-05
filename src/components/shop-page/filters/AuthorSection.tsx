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

const AuthorSection = () => {
  const { filters, toggleArrayFilter } = useFilters();
  const { products } = useProducts();

  // Get unique authors from products dynamically
  const authors = [...new Set(products.map((p: any) => p.author).filter(Boolean))].sort();

  return (
    <Accordion type="single" collapsible defaultValue="filter-author">
      <AccordionItem value="filter-author" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Author
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <div className="space-y-3">
            {authors.map((author, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <Checkbox
                  id={`author-${idx}`}
                  checked={filters.authors.includes(author)}
                  onChange={() => toggleArrayFilter('authors', author)}
                />
                <label
                  htmlFor={`author-${idx}`}
                  className="text-sm text-black/60 cursor-pointer"
                >
                  {author}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AuthorSection;