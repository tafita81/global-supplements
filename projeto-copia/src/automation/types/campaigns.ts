export interface GoogleAdsCampaign {
  id: string;
  name: string;
  country: string;
  niche: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget?: number;
  created_at: string;
  updated_at: string;
}

export interface GoogleAdsHeadline {
  id: string;
  campaign_id: string;
  text: string;
  icon?: string;
  language: string;
  performance_score: number;
  created_at: string;
}

export interface GoogleAdsDescription {
  id: string;
  campaign_id: string;
  text: string;
  icon?: string;
  language: string;
  performance_score: number;
  created_at: string;
}

export interface CampaignPerformance {
  id: string;
  campaign_id: string;
  country: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  revenue: number;
  date: string;
  created_at: string;
}

export const GLOBAL_HEADLINES = [
  { text: "Top Products in 20+ Countries", icon: "🌎" },
  { text: "Amazon Choice Global Picks", icon: "🛍️" },
  { text: "Smart Links by Region", icon: "🔗" },
  { text: "Shop Local, Earn Global", icon: "💰" },
  { text: "Top Reviews Worldwide", icon: "🌐" },
  { text: "Fast Delivery Anywhere", icon: "🚚" },
  { text: "Smart Amazon Selections", icon: "🧠" },
  { text: "One Link, Local Store", icon: "🏪" },
  { text: "Best-Sellers Around World", icon: "🌍" },
  { text: "Top 5 Amazon by Country", icon: "🥇" },
  { text: "Supplements with Reviews", icon: "💊" },
  { text: "Skincare Global Favorites", icon: "💅" },
  { text: "Wellness with Global Reach", icon: "🧘" },
  { text: "Fitness for Every Continent", icon: "🏋️" },
  { text: "Right Choice Any Language", icon: "🗣️" }
];

export const GLOBAL_DESCRIPTIONS = [
  { text: "Discover best-sellers in every country with fast local delivery.", icon: "🌎" },
  { text: "Top-rated products with Amazon Choice badge across multiple regions.", icon: "🛍️" },
  { text: "One link auto-redirects to your local Amazon store. No extra steps.", icon: "🔗" },
  { text: "Buy locally with global curation. One site, multiple countries.", icon: "💰" },
  { text: "See what users love globally. Trusted reviews from every corner.", icon: "🌐" },
  { text: "Get your order fast, wherever you are. Global reach, local speed.", icon: "🚚" },
  { text: "Curated picks based on real reviews and local preferences.", icon: "🧠" },
  { text: "Click once and shop from your country's Amazon store instantly.", icon: "🏪" },
  { text: "Explore top-selling Amazon products across the globe.", icon: "🌍" },
  { text: "See the top 5 Amazon favorites in each country with one click.", icon: "🥇" },
  { text: "Top-rated supplements with thousands of global reviews.", icon: "💊" },
  { text: "Amazon Choice skincare with fast international delivery.", icon: "💅" },
  { text: "Wellness products curated for every region and lifestyle.", icon: "🧘" },
  { text: "Best-selling fitness gear across continents. Shop smart.", icon: "🏋️" },
  { text: "Shop confidently in any language or country. OneLink does the work.", icon: "🗣️" }
];
