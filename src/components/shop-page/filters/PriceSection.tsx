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

  // Calculate min and max prices from products with discounts applied
  const priceRange = useMemo(() => {
    const calculatePrice = (product: any) => {
      const mrp = product.mrp || 0;
      let finalPrice = mrp;

      if (product.has_own_discount && product.own_discount_percentage) {
        finalPrice = mrp - (mrp * product.own_discount_percentage / 100);
      } else if (product.use_category_discount && product.categories) {
        const category = product.categories;
        if (category.offer_type === 'percentage' && category.offer_percentage) {
          finalPrice = mrp - (mrp * category.offer_percentage / 100);
        } else if (category.offer_type === 'flat_amount' && category.offer_amount) {
          finalPrice = mrp - category.offer_amount;
        }
      }

      return Math.max(0, Math.round(finalPrice));
    };

    const prices = products.map((p: any) => calculatePrice(p)).filter(p => p > 0);
    if (prices.length === 0) return { min: 0, max: 10000 };
    
    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));
    
    return {
      min: minPrice,
      max: maxPrice
    };
  }, [products]);

  const handlePriceChange = (value: number[]) => {
    updateFilter('priceRange', { min: value[0], max: value[1] });
  };

  // Use actual price range or filter values
  const currentMin = filters.priceRange.min === 0 ? priceRange.min : filters.priceRange.min;
  const currentMax = filters.priceRange.max === 10000 ? priceRange.max : filters.priceRange.max;

  return (
    <Accordion type="single" collapsible defaultValue="filter-price">
      <AccordionItem value="filter-price" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Price
        </AccordionTrigger>
        <AccordionContent className="pt-4" contentClassName="overflow-visible">
          <Slider
            value={[currentMin, currentMax]}
            onValueChange={handlePriceChange}
            min={priceRange.min}
            max={priceRange.max}
            step={1}
            label="₹"
          />
          <div className="flex justify-between text-sm text-black/60 mt-2">
            <span>₹{priceRange.min}</span>
            <span>₹{priceRange.max}</span>
          </div>
          <div className="mb-3" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PriceSection;
