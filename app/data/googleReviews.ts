import raw from "./google-reviews.json";
import type { GoogleReview } from "../types/googleReviews";

type RawJson = {
  business: string;
  source: "google";
  reviews: Array<{
    id: string;
    author: string;
    date: string;
    rating?: number | null;
    text: string;
    truncated?: boolean;
    url?: string;
  }>;
};

const data = raw as RawJson;

export const GOOGLE_REVIEWS = {
  header: {
    kicker: "Opiniones",
    title: "Opiniones reales de Google",
    subtitle: "Lo que más se repite: calma, limpieza y trato impecable.",
  },
  rating: {
    value: 4.9,
    count: 268,
    url: "https://share.google/gDtg6LmhAFY7sZA87",
  },
  // normalizamos y forzamos rating 1..5
  reviews: data.reviews.map((r): GoogleReview => ({
    id: r.id,
    author: r.author,
    rating: (r.rating ?? 5) as GoogleReview["rating"],
    date: r.date,
    text: r.text,
    source: "google",
    url: r.url,
    })) satisfies GoogleReview[],
} as const;
