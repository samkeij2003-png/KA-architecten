export interface NewsItem {
  slug: string;
  title: string;
  date: string; // ISO 8601: "2026-05-20"
  intro: string;
  body: string[];
  tags?: string[];
}

export const nieuws: NewsItem[] = [
  // Artikelen komen hier
];
