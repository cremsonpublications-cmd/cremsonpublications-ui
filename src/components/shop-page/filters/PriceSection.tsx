import React, { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { useFilters } from "../../../context/FilterContext";
import { useProducts } from "../../../context/ProductContext";

const PriceSection = () => {
  const { filters, updateFilter } = useFilters();
  const { products } = useProducts();

  // Calculate min and max prices from products
  const priceRange = useMemo(() => {
    const prices = products.map((p: any) => p.price).filter(Boolean);
    if (prices.length === 0) return { min: 0, max: 1000 };
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [products]);

  const handlePriceChange = (value: number[]) => {
    updateFilter('priceRange', { min: value[0], max: value[1] });
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-price">
      <AccordionItem value="filter-price" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Price
        </AccordionTrigger>
        <AccordionContent className="pt-4" contentClassName="overflow-visible">
          <Slider
            value={[filters.priceRange.min, filters.priceRange.max]}
            onValueChange={handlePriceChange}
            min={priceRange.min}
            max={priceRange.max}
            step={1}
            label="₹"
          />
          <div className="flex justify-between text-sm text-black/60 mt-2">
            <span>₹{filters.priceRange.min}</span>
            <span>₹{filters.priceRange.max}</span>
          </div>
          <div className="mb-3" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PriceSection;
