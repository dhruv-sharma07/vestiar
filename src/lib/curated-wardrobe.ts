export interface CuratedItem {
  id: string;
  name: string;
  category: "tops" | "bottoms" | "footwear" | "outerwear";
  subCategory: string;
  colorName: string;
  colorHex: string;
  brand: string;
  price: number;
  imageUrl: string;
  pastelTag: {
    bg: string;
    text: string;
    border: string;
  };
  occasions: ("gym" | "work" | "party" | "casual")[];
}

// 4 Minimalist Core Pieces for 1-Click Demo
export const SAMPLE_FOUR_ITEMS: CuratedItem[] = [
  {
    id: "sample-1",
    name: "Heavyweight Boxy Supima Tee",
    category: "tops",
    subCategory: "T-Shirt",
    colorName: "Chalk White",
    colorHex: "#FAF9F5",
    brand: "Studio Nicholson",
    price: 45,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85",
    pastelTag: {
      bg: "bg-[#E8EEE7]",
      text: "text-[#2D4A34]",
      border: "border-[#D1DFD0]",
    },
    occasions: ["casual", "gym", "work"],
  },
  {
    id: "sample-2",
    name: "Pleated Relaxed Fluid Trousers",
    category: "bottoms",
    subCategory: "Trousers",
    colorName: "Mocha Taupe",
    colorHex: "#9E9589",
    brand: "Lemaire",
    price: 135,
    imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=85",
    pastelTag: {
      bg: "bg-[#F3EFEA]",
      text: "text-[#5C5349]",
      border: "border-[#E4DCD2]",
    },
    occasions: ["work", "party", "casual"],
  },
  {
    id: "sample-3",
    name: "Minimalist Calfskin Court Low-Tops",
    category: "footwear",
    subCategory: "Sneakers",
    colorName: "Alabaster White",
    colorHex: "#F5F5F4",
    brand: "Common Projects",
    price: 260,
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=85",
    pastelTag: {
      bg: "bg-[#E8EEE7]",
      text: "text-[#2D4A34]",
      border: "border-[#D1DFD0]",
    },
    occasions: ["casual", "work", "party", "gym"],
  },
  {
    id: "sample-4",
    name: "Washed Cotton Utility Chore Overshirt",
    category: "outerwear",
    subCategory: "Overshirt",
    colorName: "Earthy Olive",
    colorHex: "#475136",
    brand: "Margaret Howell",
    price: 185,
    imageUrl: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=85",
    pastelTag: {
      bg: "bg-[#FDF8ED]",
      text: "text-[#7B6127]",
      border: "border-[#E8D9B9]",
    },
    occasions: ["casual", "work", "party"],
  },
];

export interface DynamicOccasionOutfit {
  occasion: "gym" | "work" | "party" | "casual";
  title: string;
  tagline: string;
  palette: string[];
  matchScore: number;
  stylistNote: string;
  items: CuratedItem[];
}

export function generateDynamicOutfit(
  items: CuratedItem[],
  occasion: "gym" | "work" | "party" | "casual"
): DynamicOccasionOutfit | null {
  if (items.length === 0) return null;

  // Find preferred items tagged for this occasion
  let tops = items.filter((i) => i.category === "tops" && i.occasions.includes(occasion));
  if (tops.length === 0) tops = items.filter((i) => i.category === "tops");

  let bottoms = items.filter((i) => i.category === "bottoms" && i.occasions.includes(occasion));
  if (bottoms.length === 0) bottoms = items.filter((i) => i.category === "bottoms");

  let shoes = items.filter((i) => i.category === "footwear" && i.occasions.includes(occasion));
  if (shoes.length === 0) shoes = items.filter((i) => i.category === "footwear");

  const outerwear = items.find((i) => i.category === "outerwear");

  // Pair top + bottom + shoe if available
  const top = tops[0] || items[0];
  const bottom = bottoms[0] || (items.length > 1 ? items[1] : undefined);
  const shoe = shoes[0] || (items.length > 2 ? items[2] : undefined);

  const paired = [top, bottom, shoe, outerwear].filter(Boolean) as CuratedItem[];

  const METADATA = {
    gym: {
      title: "Lightweight High-Mobility Set",
      tagline: "Engineered for training, breathable movement & cool comfort.",
      stylistNote:
        "Breathable airy upper paired with flexible ergonomic bottoms. Neutral trainers ground the athletic silhouette with effortless balance.",
      score: 98,
      palette: ["#FAF9F5", "#9E9589", "#F5F5F4"],
    },
    work: {
      title: "Refined Modern Tailored Smart-Casual",
      tagline: "Polished for meetings, creative studios, and professional presentations.",
      stylistNote:
        "Clean, structured silhouette with high-contrast proportions. Minimalist footwear anchors the look with quiet luxury understatement.",
      score: 96,
      palette: ["#FAF9F5", "#475136", "#9E9589", "#F5F5F4"],
    },
    party: {
      title: "Understated Evening Monochrome",
      tagline: "Relaxed European nightlife tailoring with subtle texture.",
      stylistNote:
        "Soft drape layering anchored by refined footwear. Unbutton collar slightly for an effortless, confident twilight aesthetic.",
      score: 95,
      palette: ["#1E293B", "#9E9589", "#F5F5F4"],
    },
    casual: {
      title: "Weekend Gallery Stroll & Espresso",
      tagline: "Understated neutrals with architectural utility layers.",
      stylistNote:
        "Chalk white essentials elevated by the olive utility overshirt, grounded by relaxed trousers and pristine calfskin court sneakers.",
      score: 97,
      palette: ["#FAF9F5", "#475136", "#9E9589"],
    },
  }[occasion];

  return {
    occasion,
    title: METADATA.title,
    tagline: METADATA.tagline,
    matchScore: METADATA.score,
    stylistNote: METADATA.stylistNote,
    palette: paired.map((p) => p.colorHex).slice(0, 4),
    items: paired,
  };
}
