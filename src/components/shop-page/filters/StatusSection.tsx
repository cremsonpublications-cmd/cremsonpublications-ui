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

const StatusSection = () => {
  const { filters, toggleArrayFilter } = useFilters();
  const { products } = useProducts();

  // Get unique statuses from products dynamically
  const statuses = [...new Set(products.map((p: any) => p.status).filter(Boolean))].sort();

  return (
    <Accordion type="single" collapsible defaultValue="filter-status">
      <AccordionItem value="filter-status" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Status
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <div className="space-y-3">
            {statuses.map((status, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${idx}`}
                  checked={filters.status.includes(status)}
                  onChange={() => toggleArrayFilter('status', status)}
                />
                <label
                  htmlFor={`status-${idx}`}
                  className="text-sm text-black/60 cursor-pointer"
                >
                  {status}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default StatusSection;