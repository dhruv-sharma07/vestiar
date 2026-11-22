"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ClothingItem, ClothingCategory, Occasion, OutfitSuggestion, WeatherCondition } from "@/types/wardrobe";
import { INITIAL_CLOTHES } from "@/lib/mock-data";

interface WardrobeState {
  items: ClothingItem[];
  activeTab: "wardrobe" | "stylist" | "planner" | "analytics";
  searchQuery: string;
  selectedCategory: ClothingCategory;
  selectedOccasion: Occasion | "all";
  showOnlyClean: boolean;
  weather: WeatherCondition;
  generatedOutfits: OutfitSuggestion[];
  isGenerating: boolean;
  selectedStylistOccasion: Occasion;

  // Actions
  setActiveTab: (tab: "wardrobe" | "stylist" | "planner" | "analytics") => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: ClothingCategory) => void;
  setSelectedOccasion: (occ: Occasion | "all") => void;
  setShowOnlyClean: (cleanOnly: boolean) => void;
  setSelectedStylistOccasion: (occ: Occasion) => void;
  setWeather: (weather: Partial<WeatherCondition>) => void;

  // Item Mutations
  addItem: (item: Omit<ClothingItem, "id" | "timesWorn" | "isClean" | "isFavorite">) => void;
  removeItem: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleCleanStatus: (id: string) => void;
  recordWear: (itemId: string) => void;

  // AI Outfit Actions
  generateOutfitsForOccasion: (occasion: Occasion) => void;
  toggleOutfitLike: (outfitId: string) => void;
  resetToDefault: () => void;
}

export const useWardrobeStore = create<WardrobeState>()(
  persist(
    (set, get) => ({
      items: INITIAL_CLOTHES,
      activeTab: "wardrobe",
      searchQuery: "",
      selectedCategory: "all",
      selectedOccasion: "all",
      showOnlyClean: false,
      weather: {
        temp: 24,
        condition: "Sunny",
        city: "Mumbai, IN",
        feelsLike: 25,
      },
      generatedOutfits: [],
      isGenerating: false,
      selectedStylistOccasion: "gym",

      setActiveTab: (tab) => set({ activeTab: tab }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      setSelectedOccasion: (occ) => set({ selectedOccasion: occ }),
      setShowOnlyClean: (cleanOnly) => set({ showOnlyClean: cleanOnly }),
      setSelectedStylistOccasion: (occ) => set({ selectedStylistOccasion: occ }),
      setWeather: (newWeather) =>
        set((state) => ({ weather: { ...state.weather, ...newWeather } })),

      addItem: (newItem) => {
        const item: ClothingItem = {
          ...newItem,
          id: `item-${Date.now()}`,
          timesWorn: 0,
          isClean: true,
          isFavorite: false,
        };
        set((state) => ({ items: [item, ...state.items] }));
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      toggleFavorite: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, isFavorite: !i.isFavorite } : i
          ),
        })),

      toggleCleanStatus: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, isClean: !i.isClean } : i
          ),
        })),

      recordWear: (itemId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId
              ? {
                  ...i,
                  timesWorn: i.timesWorn + 1,
                  lastWornDate: new Date().toISOString().split("T")[0],
                }
              : i
          ),
        })),

      generateOutfitsForOccasion: (occasion: Occasion) => {
        set({ isGenerating: true, selectedStylistOccasion: occasion });

        const { items, weather } = get();

        // Simulate intelligent AI reasoning latency (600ms)
        setTimeout(() => {
          const eligibleItems = items.filter(
            (i) => i.isClean && i.occasions.includes(occasion)
          );

          // Find tops, bottoms, shoes, outerwear, ethnic, accessories
          const tops = eligibleItems.filter(
            (i) => i.category === "top" || i.category === "ethnic"
          );
          const bottoms = eligibleItems.filter((i) => i.category === "bottom");
          const shoes = eligibleItems.filter((i) => i.category === "shoes");
          const outerwears = eligibleItems.filter((i) => i.category === "outerwear");
          const accessories = eligibleItems.filter((i) => i.category === "accessories");

          const suggestions: OutfitSuggestion[] = [];

          if (occasion === "gym") {
            const gymTop = tops.find((i) => i.style === "sporty") || tops[0];
            const gymBottom = bottoms.find((i) => i.style === "sporty") || bottoms[0];
            const gymShoes = shoes.find((i) => i.style === "sporty") || shoes[0];

            if (gymTop && gymBottom) {
              const outfitItems = [gymTop, gymBottom, gymShoes].filter(Boolean);
              suggestions.push({
                id: `outfit-${Date.now()}-1`,
                title: "Peak Performance Power Fit",
                occasion: "gym",
                score: 96,
                styleReasoning:
                  "High-breathability tech polyester paired with flexible 7'' training shorts. Moisture-wicking and designed for high mobility and zero distraction during lifting or cardio.",
                weatherFit: `Optimized for ${weather.temp}°C ${weather.condition} climate with lightweight airflow.`,
                colorPalette: [gymTop.colorHex, gymBottom.colorHex, "#10B981"],
                items: outfitItems,
                tips: [
                  "Wear athletic moisture-wicking ankle socks",
                  "Keep a gym towel & shaker bottle handy",
                ],
              });
            }
          } else if (occasion === "office") {
            const oxford = tops.find((i) => i.style === "formal") || tops[0];
            const chino = bottoms.find((i) => i.style === "formal") || bottoms[0];
            const blazer = outerwears.find((i) => i.style === "formal");
            const loafer = shoes.find((i) => i.style === "formal") || shoes[0];
            const watch = accessories.find((i) => i.subCategory === "Watch");

            const outfitItems = [oxford, chino, blazer, loafer, watch].filter(Boolean) as ClothingItem[];
            suggestions.push({
              id: `outfit-${Date.now()}-1`,
              title: "Executive Modern Smart-Formal",
              occasion: "office",
              score: 95,
              styleReasoning:
                "Crisp white structured cotton gives authority, tempered by tailored navy chinos. The unstructured blazer adds polish without being stiff.",
              weatherFit: `Layered for temperature control between outdoor ${weather.temp}°C and indoor AC.`,
              colorPalette: ["#F9FAFB", "#1E3A8A", "#78350F"],
              items: outfitItems,
              tips: [
                "Ensure cuff ends peek 1/4 inch past the blazer sleeve",
                "Match the cognac loafers with your leather belt tone",
              ],
            });
          } else if (occasion === "wedding") {
            const kurta = items.find((i) => i.subCategory === "Kurta") || tops[0];
            const bundi = items.find((i) => i.subCategory === "Nehru Jacket");
            const churidar = bottoms.find((i) => i.style === "ethnic") || bottoms[0];
            const footwear = shoes.find((i) => i.style === "formal") || shoes[0];
            const watch = accessories.find((i) => i.subCategory === "Watch");

            const outfitItems = [kurta, bundi, churidar, footwear, watch].filter(Boolean) as ClothingItem[];
            suggestions.push({
              id: `outfit-${Date.now()}-1`,
              title: "Regal Heritage Chikankari Ensemble",
              occasion: "wedding",
              score: 98,
              styleReasoning:
                "Deep emerald hand-embroidered kurta creates a rich, celebratory focal point. The antique gold Bundi vest provides royal contrast, anchored by clean ivory churidar.",
              weatherFit: "Pure natural silks and breathable cottons prevent overheating during indoor festivities.",
              colorPalette: ["#064E3B", "#D97706", "#FEF3C7"],
              items: outfitItems,
              tips: [
                "Fold the Bundi pocket square neatly",
                "Pair with a statement silver or gold watch",
              ],
            });
          } else if (occasion === "party") {
            const resortShirt = tops.find((i) => i.subCategory === "Camp Shirt") || tops[0];
            const jeans = bottoms.find((i) => i.category === "bottom") || bottoms[0];
            const boots = shoes.find((i) => i.subCategory === "Boots") || shoes[0];
            const shades = accessories.find((i) => i.subCategory === "Eyewear");

            const outfitItems = [resortShirt, jeans, boots, shades].filter(Boolean) as ClothingItem[];
            suggestions.push({
              id: `outfit-${Date.now()}-1`,
              title: "Monochrome Midnight Edge",
              occasion: "party",
              score: 93,
              styleReasoning:
                "Camp collar noir linen shirt unbuttoned slightly delivers an effortless European nightlife aesthetic. Raw selvedge denim and suede boots provide masculine structure.",
              weatherFit: "Breathable textured fabric keeps you cool inside lively nightlife venues.",
              colorPalette: ["#0F172A", "#2563EB", "#A8A29E"],
              items: outfitItems,
              tips: [
                "Leave top 2 buttons unfastened for a relaxed silhouette",
                "Light spray of woody / amber cologne",
              ],
            });
          } else {
            // Casual / Date / Travel fallback
            const top = tops[0];
            const bottom = bottoms[0];
            const shoe = shoes[0];
            const acc = accessories[0];

            const outfitItems = [top, bottom, shoe, acc].filter(Boolean) as ClothingItem[];
            suggestions.push({
              id: `outfit-${Date.now()}-1`,
              title: "Curated Contemporary Casual",
              occasion: occasion,
              score: 91,
              styleReasoning:
                "Harmonious neutral palette balancing comfort with crisp architectural silhouettes. Clean sneakers ground the relaxed silhouette.",
              weatherFit: `Comfortable and breathable for today's ${weather.temp}°C conditions.`,
              colorPalette: [top?.colorHex || "#333", bottom?.colorHex || "#666", "#FFF"],
              items: outfitItems,
              tips: ["Roll cuffs once if wearing low-top sneakers", "Keep accessories minimal"],
            });
          }

          // Generate alternative outfit suggestion
          if (tops.length > 1 && bottoms.length > 1) {
            const altTop = tops[tops.length - 1];
            const altBottom = bottoms[bottoms.length - 1];
            const altShoe = shoes[shoes.length - 1] || shoes[0];

            suggestions.push({
              id: `outfit-${Date.now()}-2`,
              title: "Alternative Relaxed Coordination",
              occasion: occasion,
              score: 88,
              styleReasoning:
                "A more laid-back spin prioritizing effortless comfort and high versatility across shifting daylight and evening lighting.",
              weatherFit: `Layerable if weather shifts from ${weather.temp}°C.`,
              colorPalette: [altTop.colorHex, altBottom.colorHex, altShoe?.colorHex || "#999"],
              items: [altTop, altBottom, altShoe].filter(Boolean),
              tips: ["Great backup option if you want a more low-profile look"],
            });
          }

          set({ generatedOutfits: suggestions, isGenerating: false });
        }, 650);
      },

      toggleOutfitLike: (outfitId: string) =>
        set((state) => ({
          generatedOutfits: state.generatedOutfits.map((o) =>
            o.id === outfitId ? { ...o, isLiked: !o.isLiked } : o
          ),
        })),

      resetToDefault: () =>
        set({
          items: INITIAL_CLOTHES,
          selectedCategory: "all",
          selectedOccasion: "all",
          searchQuery: "",
          showOnlyClean: false,
        }),
    }),
    {
      name: "fit-iq-wardrobe-storage",
      partialize: (state) => ({
        items: state.items,
        weather: state.weather,
      }),
    }
  )
);
