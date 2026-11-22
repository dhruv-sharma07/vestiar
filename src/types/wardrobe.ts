export type ClothingCategory =
  | "all"
  | "top"
  | "bottom"
  | "shoes"
  | "outerwear"
  | "ethnic"
  | "accessories";

export type Occasion =
  | "gym"
  | "office"
  | "party"
  | "wedding"
  | "casual"
  | "date"
  | "travel";

export type Season = "all-season" | "summer" | "winter" | "monsoon" | "autumn";

export interface ClothingItem {
  id: string;
  name: string;
  category: "top" | "bottom" | "shoes" | "outerwear" | "ethnic" | "accessories";
  subCategory: string; // e.g., "Oversized Tee", "Chinos", "Running Shoes", "Kurta", "Blazer"
  color: string;
  colorHex: string;
  secondaryColor?: string;
  pattern: "solid" | "striped" | "plaid" | "printed" | "graphic" | "textured";
  fabric: "cotton" | "linen" | "denim" | "polyester" | "wool" | "silk" | "leather";
  style: "formal" | "casual" | "sporty" | "ethnic" | "streetwear" | "smart-casual";
  occasions: Occasion[];
  seasons: Season[];
  brand: string;
  price: number;
  timesWorn: number;
  isClean: boolean;
  isFavorite: boolean;
  lastWornDate?: string;
  imageUrl: string;
  notes?: string;
}

export interface OutfitSuggestion {
  id: string;
  title: string;
  occasion: Occasion;
  score: number; // 0 - 100 confidence
  styleReasoning: string;
  weatherFit: string;
  colorPalette: string[];
  items: ClothingItem[];
  tips: string[];
  isLiked?: boolean;
}

export interface WeatherCondition {
  temp: number; // in Celsius
  condition: "Sunny" | "Cloudy" | "Rainy" | "Cold" | "Hot";
  city: string;
  feelsLike: number;
}
