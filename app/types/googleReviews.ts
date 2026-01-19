export type GoogleReview = {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  text: string;
  source: "google";
  url?: string;
};
