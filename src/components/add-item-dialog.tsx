"use client";

import React, { useState } from "react";
import { Sparkles, Upload, Image as ImageIcon, Check, Loader2 } from "lucide-react";
import { useWardrobeStore } from "@/store/wardrobe-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ClothingCategory, Occasion, ClothingItem } from "@/types/wardrobe";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SAMPLE_PRESETS = [
  {
    name: "Oversized Vintage Graphic Hoodie",
    category: "top" as const,
    subCategory: "Hoodie",
    color: "Charcoal Grey",
    colorHex: "#374151",
    fabric: "cotton" as const,
    style: "streetwear" as const,
    occasions: ["casual", "travel"] as Occasion[],
    brand: "Fear of God Essentials",
    price: 90,
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Pure Raw Silk Kurta with Gold Buttons",
    category: "ethnic" as const,
    subCategory: "Kurta",
    color: "Midnight Blue",
    colorHex: "#1E293B",
    fabric: "silk" as const,
    style: "ethnic" as const,
    occasions: ["wedding", "party"] as Occasion[],
    brand: "Sabyasachi Heritage",
    price: 220,
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Breathable Seamless Gym Tank",
    category: "top" as const,
    subCategory: "Gym Tank",
    color: "Arctic White",
    colorHex: "#F3F4F6",
    fabric: "polyester" as const,
    style: "sporty" as const,
    occasions: ["gym"] as Occasion[],
    brand: "Under Armour HeatGear",
    price: 32,
    imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80",
  },
];

export function AddItemDialog({ open, onOpenChange }: AddItemDialogProps) {
  const { addItem } = useWardrobeStore();

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState<ClothingCategory>("top");
  const [subCategory, setSubCategory] = useState("");
  const [color, setColor] = useState("Black");
  const [colorHex, setColorHex] = useState("#111827");
  const [fabric, setFabric] = useState<ClothingItem["fabric"]>("cotton");
  const [style, setStyle] = useState<ClothingItem["style"]>("casual");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState(45);
  const [selectedOccasions, setSelectedOccasions] = useState<Occasion[]>(["casual"]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);

  const toggleOccasion = (occ: Occasion) => {
    if (selectedOccasions.includes(occ)) {
      setSelectedOccasions(selectedOccasions.filter((o) => o !== occ));
    } else {
      setSelectedOccasions([...selectedOccasions, occ]);
    }
  };

  const handleSimulateAIScan = () => {
    setIsScanning(true);
    setScanCompleted(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanCompleted(true);
      // Auto-populate intelligent attributes
      if (!name) setName("Tailored Lightweight Italian Overcoat");
      if (!imageUrl) setImageUrl("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80");
      setCategory("outerwear");
      setSubCategory("Overcoat");
      setColor("Camel Tan");
      setColorHex("#D97706");
      setFabric("wool");
      setStyle("smart-casual");
      setSelectedOccasions(["office", "date", "party"]);
      setBrand("Massimo Dutti");
      setPrice(180);
    }, 800);
  };

  const handlePresetSelect = (preset: typeof SAMPLE_PRESETS[0]) => {
    setName(preset.name);
    setImageUrl(preset.imageUrl);
    setCategory(preset.category);
    setSubCategory(preset.subCategory);
    setColor(preset.color);
    setColorHex(preset.colorHex);
    setFabric(preset.fabric);
    setStyle(preset.style);
    setSelectedOccasions(preset.occasions);
    setBrand(preset.brand);
    setPrice(preset.price);
    setScanCompleted(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addItem({
      name,
      category: category === "all" ? "top" : category,
      subCategory: subCategory || name,
      color,
      colorHex,
      pattern: "solid",
      fabric,
      style,
      occasions: selectedOccasions.length > 0 ? selectedOccasions : ["casual"],
      seasons: ["all-season"],
      brand: brand || "Custom",
      price: Number(price) || 0,
      imageUrl:
        imageUrl ||
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    });

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setImageUrl("");
    setCategory("top");
    setSubCategory("");
    setColor("Black");
    setColorHex("#111827");
    setSelectedOccasions(["casual"]);
    setScanCompleted(false);
  };

  const ALL_OCCASIONS: Occasion[] = ["gym", "office", "party", "wedding", "casual", "date", "travel"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-violet-500/10 p-2 text-violet-600 dark:text-violet-400">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Add Clothing Item</DialogTitle>
              <DialogDescription className="text-xs">
                Upload a photo or choose a preset. AI Vision will auto-tag category, color & occasions.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Quick Sample Presets */}
        <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
            ⚡ Quick Test Presets (One-Click Auto-Fill):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SAMPLE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className="flex flex-col text-left rounded-lg border border-border/70 bg-background/80 p-2.5 text-xs hover:border-violet-500/50 hover:bg-violet-50/20 dark:hover:bg-violet-950/20 transition-all"
              >
                <span className="font-semibold text-foreground line-clamp-1">{preset.name}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  {preset.category} • {preset.brand}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Auto-Tag Trigger */}
        <div className="flex items-center justify-between rounded-xl border border-violet-500/30 bg-violet-500/5 p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Gemini Vision AI Auto-Tagging</p>
              <p className="text-[11px] text-muted-foreground">
                Detects fabric, color palette, style formality & pairings
              </p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleSimulateAIScan}
            disabled={isScanning}
            className="rounded-full bg-violet-600 hover:bg-violet-700 text-white text-xs h-8 px-3"
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Scanning...
              </>
            ) : scanCompleted ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5" />
                Auto-Tagged!
              </>
            ) : (
              "Auto-Scan Photo"
            )}
          </Button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                Item Name *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Navy Linen Button-Down"
                required
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                Image URL (or unspash photo link)
              </label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="h-9 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ClothingCategory)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
              >
                <option value="top">Top (Shirt/Tee)</option>
                <option value="bottom">Bottom (Pants/Shorts)</option>
                <option value="shoes">Footwear (Shoes/Boots)</option>
                <option value="outerwear">Outerwear (Blazer/Jacket)</option>
                <option value="ethnic">Ethnic (Kurta/Bundi)</option>
                <option value="accessories">Accessories (Watch/Shades)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Sub-Type</label>
              <Input
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="e.g. Chinos"
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Color Name</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded-md border border-input p-1"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Navy"
                  className="h-9 text-xs flex-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Fabric</label>
              <select
                value={fabric}
                onChange={(e) => setFabric(e.target.value as ClothingItem["fabric"])}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
              >
                <option value="cotton">Cotton</option>
                <option value="linen">Linen</option>
                <option value="denim">Denim</option>
                <option value="silk">Silk</option>
                <option value="polyester">Polyester / Tech</option>
                <option value="wool">Wool</option>
                <option value="leather">Leather</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Style Aesthetic</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as ClothingItem["style"])}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
              >
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="sporty">Sporty / Athletic</option>
                <option value="smart-casual">Smart Casual</option>
                <option value="ethnic">Indian Ethnic / Traditional</option>
                <option value="streetwear">Streetwear</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Brand</label>
              <Input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Zara, Nike, etc."
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Est. Price ($)</label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="50"
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Occasion Tags */}
          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">
              Suitable Occasions (Select all that fit)
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_OCCASIONS.map((occ) => {
                const active = selectedOccasions.includes(occ);
                return (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => toggleOccasion(occ)}
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-all ${
                      active
                        ? "bg-violet-600 text-white shadow-sm"
                        : "border border-border/80 bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {occ === "gym" && "🏋️ Gym"}
                    {occ === "office" && "💼 Office"}
                    {occ === "party" && "🎉 Party"}
                    {occ === "wedding" && "💒 Wedding/Ethnic"}
                    {occ === "casual" && "☕ Casual"}
                    {occ === "date" && "🍷 Date Night"}
                    {occ === "travel" && "✈️ Travel"}
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-foreground text-background hover:bg-foreground/90 text-xs px-5"
            >
              Save to Wardrobe
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
