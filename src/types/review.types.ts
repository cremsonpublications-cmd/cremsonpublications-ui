export type Review = {
  id: number;
  user: string;
  content: string;
  rating: number;
  date: string;
  images?: string[];
};

export type ReviewImage = {
  id: number;
  review_id: number;
  image_url: string;
  caption?: string;
  created_at: string;
};

export type DatabaseReview = {
  id: number;
  product_id: number;
  user_name: string;
  user_email: string | null;
  rating: number;
  title: string | null;
  comment: string;
  helpful_count: number;
  verified_purchase: boolean;
  created_at: string;
  updated_at: string;
  images?: ReviewImage[];
};

export type ReviewFormData = {
  product_id: number;
  user_name: string;
  user_email?: string;
  rating: number;
  title?: string;
  comment: string;
  verified_purchase?: boolean;
  images?: File[];
};
