export type Discount = {
  amount: number;
  percentage: number;
};

export type Product = {
  id: number;
  name: string;
  category_id: number;
  price: number;
  old_price?: number | null;
  status: string;
  author?: string;
  isbn?: string | null;
  edition?: string | null;
  description?: string | null;
  classes?: string | null;
  tags: string[];
  main_image: string;
  side_images: string[];
  delivery_info?: string;
  returns_info?: string;
  bulk_pricing: any[];
  has_own_discount: boolean;
  own_discount_percentage?: number | null;
  reviews: any[];
  weight?: number | null;
  year?: number | null;
  rating: number;
  review_count?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  categories?: {
    id: number;
    name: string;
  };
};

// Legacy type for backward compatibility
export type OldProduct = {
  id: number;
  title: string;
  srcUrl: string;
  gallery?: string[];
  price: number;
  discount: Discount;
  rating: number;
};
