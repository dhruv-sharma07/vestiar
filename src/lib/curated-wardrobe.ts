export interface CuratedItem {
  id: string;
  name: string;
  category: "tops" | "bottoms" | "footwear" | "outerwear" | "accessories";
  subCategory: string;
  colorName: string;
  colorHex: string;
  brand: string;
  price: number; // in Indian Rupees (INR)
  imageUrl: string;
  pastelTag: {
    bg: string;
    text: string;
    border: string;
  };
  occasions: ("gym" | "work" | "party" | "casual")[];
}

/**
 * Format price in Indian Rupees (e.g. ₹14,999)
 */
export function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// Curated Luxury Capsule Collection with Shoes, Muffler, Socks, Tops, Bottoms & Outerwear
export const SAMPLE_FOUR_ITEMS: CuratedItem[] = [
  {
    id: "sample-shoes-1",
    name: "Handcrafted Suede Chelsea Boots",
    category: "footwear",
    subCategory: "Boots",
    colorName: "Nutmeg Brown",
    colorHex: "#6F4E37",
    brand: "Loro Piana Atelier",
    price: 14999,
    imageUrl: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=85",
    pastelTag: {
      bg: "bg-[#E8EEE7]",
      text: "text-[#2D4A34]",
      border: "border-[#D1DFD0]",
    },
    occasions: ["work", "party", "casual"],
  },
  {
    id: "sample-muffler-1",
    name: "Ribbed Cashmere Wool Muffler",
    category: "accessories",
    subCategory: "Muffler",
    colorName: "Oatmeal Melange",
    colorHex: "#D7C9B8",
    brand: "Brunello Cucinelli",
    price: 4999,
    imageUrl: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=85",
    pastelTag: {
      bg: "bg-[#FDF8ED]",
      text: "text-[#7B6127]",
      border: "border-[#E8D9B9]",
    },
    occasions: ["casual", "work", "party"],
  },
  {
    id: "sample-socks-1",
    name: "Fine-Gauge Merino Wool Ribbed Socks",
    category: "accessories",
    subCategory: "Socks",
    colorName: "Heather Charcoal",
    colorHex: "#374151",
    brand: "Pantherella London",
    price: 1899,
    imageUrl: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=800&q=85",
    pastelTag: {
      bg: "bg-[#F3EFEA]",
      text: "text-[#5C5349]",
      border: "border-[#E4DCD2]",
    },
    occasions: ["work", "casual", "party"],
  },
  {
    id: "sample-top-1",
    name: "Heavyweight Boxy Supima Cotton Tee",
    category: "tops",
    subCategory: "T-Shirt",
    colorName: "Chalk White",
    colorHex: "#FAF9F5",
    brand: "Studio Nicholson",
    price: 2999,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85",
    pastelTag: {
      bg: "bg-[#E8EEE7]",
      text: "text-[#2D4A34]",
      border: "border-[#D1DFD0]",
    },
    occasions: ["casual", "gym", "work"],
  },
  {
    id: "sample-bottom-1",
    name: "Pleated Relaxed Fluid Trousers",
    category: "bottoms",
    subCategory: "Trousers",
    colorName: "Mocha Taupe",
    colorHex: "#9E9589",
    brand: "Lemaire Atelier",
    price: 6899,
    imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=85",
    pastelTag: {
      bg: "bg-[#F3EFEA]",
      text: "text-[#5C5349]",
      border: "border-[#E4DCD2]",
    },
    occasions: ["work", "party", "casual"],
  },
  {
    id: "sample-shoes-2",
    name: "Minimalist Italian Suede Court Sneakers",
    category: "footwear",
    subCategory: "Sneakers",
    colorName: "Alabaster White",
    colorHex: "#F5F5F4",
    brand: "Common Projects",
    price: 8499,
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=85",
    pastelTag: {
      bg: "bg-[#E8EEE7]",
      text: "text-[#2D4A34]",
      border: "border-[#D1DFD0]",
    },
    occasions: ["casual", "work", "gym"],
  },
  {
    id: "sample-outerwear-1",
    name: "Washed Cotton Utility Chore Overshirt",
    category: "outerwear",
    subCategory: "Overshirt",
    colorName: "Earthy Olive",
    colorHex: "#475136",
    brand: "Margaret Howell",
    price: 8999,
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

  // Filter items matching occasion preference
  let tops = items.filter((i) => i.category === "tops" && i.occasions.includes(occasion));
  if (tops.length === 0) tops = items.filter((i) => i.category === "tops");

  let bottoms = items.filter((i) => i.category === "bottoms" && i.occasions.includes(occasion));
  if (bottoms.length === 0) bottoms = items.filter((i) => i.category === "bottoms");

  let shoes = items.filter((i) => i.category === "footwear" && i.occasions.includes(occasion));
  if (shoes.length === 0) shoes = items.filter((i) => i.category === "footwear");

  const outerwear = items.find((i) => i.category === "outerwear" && i.occasions.includes(occasion)) ||
    items.find((i) => i.category === "outerwear");

  const accessory = items.find((i) => i.category === "accessories" && i.occasions.includes(occasion)) ||
    items.find((i) => i.category === "accessories");

  const top = tops[0] || items[0];
  const bottom = bottoms[0] || (items.length > 1 ? items[1] : undefined);
  const shoe = shoes[0] || (items.length > 2 ? items[2] : undefined);

  const paired = [top, bottom, shoe, outerwear, accessory].filter(Boolean) as CuratedItem[];

  const METADATA = {
    gym: {
      title: "Breathable High-Mobility Athletic Set",
      tagline: "Engineered for flexibility, heat dissipation and dynamic movement.",
      stylistNote:
        "High-recovery breathable top anchored with ergonomic bottoms. Minimalist trainers provide grounded cushioning, complemented by performance merino socks.",
      score: 98,
    },
    work: {
      title: "Modern Milanese Tailored Smart-Casual",
      tagline: "Structured proportions for creative boardroom meetings and studio visits.",
      stylistNote:
        "Fluid pleated trousers balanced by the tailored overshirt and suede Chelsea boots. The cashmere muffler introduces quiet luxury texture.",
      score: 97,
    },
    party: {
      title: "Understated Evening Salon Monochrome",
      tagline: "European twilight tailoring featuring tonal texture and refined footwear.",
      stylistNote:
        "Rich deep tones accented by brushed leather Chelsea boots and a fine merino scarf. An effortless, commanding silhouette for nightfall.",
      score: 96,
    },
    casual: {
      title: "Weekend Atelier Stroll & Gallery Visit",
      tagline: "Effortless casual layering in warm alabaster, mocha, and olive tones.",
      stylistNote:
        "Heavyweight Supima tee layered under the washed olive chore jacket, paired with Italian court sneakers and ribbed cashmere muffler.",
      score: 99,
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
