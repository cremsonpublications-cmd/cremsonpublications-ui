export type Review = {
  id: number;
  user: string;
  content: string;
  rating: number;
  date: string;
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
};
