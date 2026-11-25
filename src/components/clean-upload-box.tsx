"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Check,
  X,
  Loader2,
  Plus,
  Lightbulb,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { CuratedItem, formatRupees } from "@/lib/curated-wardrobe";

interface CleanUploadBoxProps {
  onAddItem: (item: CuratedItem) => void;
  guestUploadCount: number;
  isLoggedIn: boolean;
  onTriggerAuth: (reason: string) => void;
}

const PRESET_SAMPLES = [
  {
    name: "Handcrafted Suede Chelsea Boots",
    category: "footwear" as const,
    colorName: "Nutmeg Brown",
    colorHex: "#6F4E37",
    brand: "Loro Piana Atelier",
    price: 14999,
    imageUrl:
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=85",
    occasions: ["work" as const, "party" as const, "casual" as const],
  },
  {
    name: "Ribbed Cashmere Wool Muffler",
    category: "accessories" as const,
    colorName: "Oatmeal Melange",
    colorHex: "#D7C9B8",
    brand: "Brunello Cucinelli",
    price: 4999,
    imageUrl:
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=85",
    occasions: ["casual" as const, "work" as const, "party" as const],
  },
  {
    name: "Fine-Gauge Merino Wool Ribbed Socks",
    category: "accessories" as const,
    colorName: "Heather Charcoal",
    colorHex: "#374151",
    brand: "Pantherella London",
    price: 1899,
    imageUrl:
      "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=800&q=85",
    occasions: ["work" as const, "casual" as const, "party" as const],
  },
  {
    name: "Heavyweight Boxy Supima Cotton Tee",
    category: "tops" as const,
    colorName: "Chalk White",
    colorHex: "#FAF9F5",
    brand: "Studio Nicholson",
    price: 2999,
    imageUrl:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85",
    occasions: ["casual" as const, "gym" as const, "work" as const],
  },
  {
    name: "Pleated Relaxed Fluid Trousers",
    category: "bottoms" as const,
    colorName: "Mocha Taupe",
    colorHex: "#9E9589",
    brand: "Lemaire Atelier",
    price: 6899,
    imageUrl:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=85",
    occasions: ["work" as const, "party" as const, "casual" as const],
  },
];

export function CleanUploadBox({
  onAddItem,
  guestUploadCount,
  isLoggedIn,
  onTriggerAuth,
}: CleanUploadBoxProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Extracted garment state
  const [itemName, setItemName] = useState("");
  const [detectedCategory, setDetectedCategory] = useState<
    "tops" | "bottoms" | "footwear" | "outerwear" | "accessories"
  >("tops");
  const [colorName, setColorName] = useState("Neutral");
  const [colorHex, setColorHex] = useState("#27272A");
  const [brand, setBrand] = useState("Custom");
  const [price, setPrice] = useState(65);
  const [occasions, setOccasions] = useState<
    ("gym" | "work" | "party" | "casual")[]
  >(["casual"]);
  const [stylingTip, setStylingTip] = useState("");
  const [aiConfidence, setAiConfidence] = useState(96);
  const [aiSource, setAiSource] = useState("vision-classifier");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      setSelectedImage(base64Data);
      setIsAnalyzing(true);
      setIsAdded(false);

      setItemName(
        file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") || "Uploaded Garment"
      );

      try {
        const res = await fetch("/api/ai/tag-clothing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: base64Data,
            mimeType: file.type || "image/jpeg",
          }),
        });
        const data = await res.json();

        if (data.success && (data.data || data.analysis)) {
          const a = data.data || data.analysis;
          setItemName(a.name || "Custom Garment");
          setDetectedCategory(a.category || "tops");
          setColorName(a.colorName || "Neutral");
          setColorHex(a.colorHex || "#27272A");
          setOccasions(a.occasions || ["casual"]);
          setStylingTip(a.stylingTip || "");
          setAiConfidence(a.confidence || 98);
          setAiSource(data.source || "vision-classifier");
        } else if (data.error) {
          setUploadError(data.error);
        }
      } catch (err: any) {
        console.error("Analysis error:", err);
        setUploadError("Could not reach image analysis service. You can still save manually.");
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = async (preset: typeof PRESET_SAMPLES[0]) => {
    setUploadError(null);
    setSelectedImage(preset.imageUrl);
    setItemName(preset.name);
    setDetectedCategory(preset.category);
    setColorName(preset.colorName);
    setColorHex(preset.colorHex);
    setBrand(preset.brand);
    setPrice(preset.price);
    setOccasions(preset.occasions);
    setIsAdded(false);
    setIsAnalyzing(true);

    try {
      const res = await fetch("/api/ai/tag-clothing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: preset.imageUrl,
        }),
      });
      const data = await res.json();
      if (data.success && (data.data || data.analysis)) {
        const a = data.data || data.analysis;
        setStylingTip(a.stylingTip || "");
        setAiConfidence(a.confidence || 98);
        setAiSource(data.source || "vision-classifier");
      }
    } catch (e) {
      console.warn("Preset tag fallback active");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToCloset = async () => {
    if (!selectedImage) return;

    if (!isLoggedIn && guestUploadCount >= 3) {
      onTriggerAuth(
        "You have added 3 garments in guest mode. Authenticate to sync unlimited wardrobe items."
      );
      return;
    }

    setIsSaving(true);
    setUploadError(null);
    let hostedImageUrl = selectedImage;

    try {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: selectedImage }),
      });
      const uploadData = await uploadRes.json();
      if (uploadData.success && uploadData.url) {
        hostedImageUrl = uploadData.url;
      }
    } catch (err) {
      console.log("Using direct image storage fallback");
    }

    const pastelConfig = {
      tops: {
        bg: "bg-[#E8EEE7]",
        text: "text-[#2D4A34]",
        border: "border-[#D1DFD0]",
      },
      bottoms: {
        bg: "bg-[#F3EFEA]",
        text: "text-[#5C5349]",
        border: "border-[#E4DCD2]",
      },
      footwear: {
        bg: "bg-[#E8EEE7]",
        text: "text-[#2D4A34]",
        border: "border-[#D1DFD0]",
      },
      outerwear: {
        bg: "bg-[#FDF8ED]",
        text: "text-[#7B6127]",
        border: "border-[#E8D9B9]",
      },
      accessories: {
        bg: "bg-[#F5F0EB]",
        text: "text-[#6B4F3A]",
        border: "border-[#E5DCD2]",
      },
    }[detectedCategory] || {
      bg: "bg-[#FDF8ED]",
      text: "text-[#7B6127]",
      border: "border-[#E8D9B9]",
    };

    const newItem: CuratedItem = {
      id: `item-${Date.now()}`,
      name: itemName || "Custom Garment",
      category: detectedCategory,
      subCategory: detectedCategory === "tops" ? "Tee" : "Apparel",
      colorName,
      colorHex,
      brand,
      price,
      imageUrl: hostedImageUrl,
      pastelTag: pastelConfig,
      occasions,
    };

    onAddItem(newItem);
    setIsSaving(false);
    setIsAdded(true);
    setTimeout(() => {
      setSelectedImage(null);
      setIsAdded(false);
    }, 1800);
  };

  return (
    <section id="upload-section" className="py-10 sm:py-14 scroll-mt-20">
      <div className="mx-auto max-w-3xl">
        {/* Section Title */}
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#789575]">
            Garment Digitization
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#202D1F] mt-1">
            Quick Add to Wardrobe
          </h2>
          <p className="text-xs sm:text-sm text-[#586B56] mt-1">
            Upload or drop a clothing photo. Visual classifier detects categories, colors, fabrics, and occasion suitability.
          </p>
        </div>

        {/* Upload Box / Dropzone */}
        {!selectedImage ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 shadow-luxury ${
              dragActive
                ? "border-[#789575] bg-[#E8ECE0] scale-[1.01]"
                : "border-[#CAD2B4] bg-[#EFF2E1] hover:border-[#789575] hover:bg-[#E8ECE0]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DCE2C6] text-[#789575] mb-3 transition-transform duration-300 group-hover:scale-105 border border-[#CAD2B4]">
              <UploadCloud className="h-6 w-6" />
            </div>

            <h3 className="font-normal text-sm sm:text-base text-[#202D1F]">
              Drag &amp; drop your clothing photo here
            </h3>
            <p className="text-xs text-[#586B56] mt-1">
              or <span className="font-semibold text-[#789575] underline underline-offset-2">browse files</span> from your gallery
            </p>
            <span className="text-[10px] text-[#586B56] mt-3">
              Supports JPG, PNG, WEBP, HEIC: Automated Color &amp; Silhouette Analysis
            </span>
          </div>
        ) : (
          /* Preview & Auto-Tag Review Card */
          <div className="rounded-2xl border border-[#CAD2B4] bg-[#EFF2E1] p-6 sm:p-8 shadow-luxury relative overflow-hidden">
            {/* Analyzing Shimmer Bar */}
            {isAnalyzing && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#CAD2B4] via-[#789575] to-[#586B56] animate-pulse" />
            )}

            {/* Error Banner with Retry */}
            {uploadError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
                <button
                  type="button"
                  onClick={handleSaveToCloset}
                  className="inline-flex items-center gap-1 font-medium underline hover:text-rose-900 dark:hover:text-rose-100"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Retry Save</span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800/80">
              <div className="flex items-center gap-2">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 text-[#E0623A] animate-spin" />
                    <span className="text-xs font-semibold text-[#E0623A]">
                      Visual classifier is analyzing garment...
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-[#1C1917] dark:text-[#F5F2EC]">
                      Extracted Garment Attributes
                    </span>
                    <span className="rounded-md border border-[#E8D9B9] bg-[#FDF8ED] dark:border-[#4A3D22] dark:bg-[#251E12] px-2 py-0.5 text-[10px] font-medium text-[#7B6127] dark:text-[#E5C378]">
                      {aiConfidence}% Confidence
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs cursor-pointer"
                aria-label="Discard preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6 items-center">
              {/* Image Preview Container */}
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-[#EAE6DF] dark:border-[#2E2A26]">
                <Image
                  src={selectedImage}
                  alt="Preview garment"
                  fill
                  className="object-cover object-center"
                  unoptimized
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-2xs flex items-center justify-center text-white text-xs font-medium">
                    <span className="bg-stone-900/90 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#E0623A]" />
                      Analyzing Fabric &amp; Color
                    </span>
                  </div>
                )}
              </div>

              {/* Editable Tags */}
              <div className="sm:col-span-2 space-y-4">
                <div>
                  <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block mb-1">
                    Garment Name
                  </label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full h-9 rounded-lg border border-[#EAE6DF] dark:border-stone-700 bg-[#FBF9F5]/70 dark:bg-stone-800/40 px-3 text-xs text-[#1C1917] dark:text-[#F5F2EC] focus:outline-hidden focus:border-[#E0623A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block mb-1">
                      Category
                    </label>
                    <select
                      value={detectedCategory}
                      onChange={(e) =>
                        setDetectedCategory(
                          e.target.value as "tops" | "bottoms" | "footwear" | "outerwear" | "accessories"
                        )
                      }
                      className="w-full h-9 rounded-lg border border-[#EAE6DF] dark:border-stone-700 bg-[#FBF9F5]/70 dark:bg-stone-800/40 px-2.5 text-xs text-[#1C1917] dark:text-[#F5F2EC] focus:outline-hidden"
                    >
                      <option value="tops">Tops</option>
                      <option value="bottoms">Bottoms</option>
                      <option value="footwear">Footwear &amp; Shoes</option>
                      <option value="outerwear">Outerwear</option>
                      <option value="accessories">Accessories (Muffler, Socks, etc.)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block mb-1">
                      Detected Color
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={colorHex}
                        onChange={(e) => setColorHex(e.target.value)}
                        className="h-9 w-9 rounded-md border border-[#EAE6DF] dark:border-stone-700 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={colorName}
                        onChange={(e) => setColorName(e.target.value)}
                        className="flex-1 h-9 rounded-lg border border-[#EAE6DF] dark:border-stone-700 bg-[#FBF9F5]/70 dark:bg-stone-800/40 px-3 text-xs text-[#1C1917] dark:text-[#F5F2EC] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full h-9 rounded-lg border border-[#EAE6DF] dark:border-stone-700 bg-[#FBF9F5]/70 dark:bg-stone-800/40 px-3 text-xs text-[#1C1917] dark:text-[#F5F2EC] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block mb-1">
                      Est. Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full h-9 rounded-lg border border-[#EAE6DF] dark:border-stone-700 bg-[#FBF9F5]/70 dark:bg-stone-800/40 px-3 text-xs text-[#1C1917] dark:text-[#F5F2EC] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Occasion Tags (Architectural rounded-md) */}
                <div>
                  <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block mb-1.5">
                    Occasion Pairing Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(["gym", "work", "party", "casual"] as const).map((occ) => {
                      const active = occasions.includes(occ);
                      return (
                        <button
                          key={occ}
                          type="button"
                          onClick={() => {
                            if (active) {
                              setOccasions(occasions.filter((o) => o !== occ));
                            } else {
                              setOccasions([...occasions, occ]);
                            }
                          }}
                          className={`rounded-md px-3 py-1 text-[11px] font-medium capitalize transition-all cursor-pointer ${
                            active
                              ? "bg-[#1C1917] text-white dark:bg-[#F5F2EC] dark:text-[#1C1917] shadow-2xs"
                              : "border border-[#EAE6DF] dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                          }`}
                        >
                          {occ}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stylist Tip */}
                {stylingTip && (
                  <div className="rounded-lg border border-[#E8D9B9] bg-[#FDF8ED] dark:border-[#4A3D22] dark:bg-[#251E12] p-2.5 flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-[#7B6127] dark:text-[#E5C378] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#7B6127] dark:text-[#E5C378] leading-relaxed">
                      <strong>Stylist Tip:</strong> {stylingTip}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#CAD2B4]/60">
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="rounded-lg px-4 py-2 text-xs font-medium text-[#586B56] hover:text-[#202D1F] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveToCloset}
                disabled={isSaving || isAdded || isAnalyzing}
                className="flex items-center gap-1.5 rounded-lg bg-[#789575] hover:bg-[#668363] text-white px-5 py-2 text-xs font-medium transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving to Wardrobe...</span>
                  </>
                ) : isAdded ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Saved to Wardrobe</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    <span>Save to Wardrobe</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Quick Sample Photos Picker */}
        <div className="mt-8 text-center">
          <span className="text-[11px] font-medium text-[#586B56] uppercase tracking-wider block mb-3">
            Or test with a sample gallery piece:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESET_SAMPLES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(sample)}
                className="flex items-center gap-3 rounded-xl border border-[#CAD2B4] bg-[#EFF2E1] p-2.5 text-left hover:border-[#789575] transition-all group cursor-pointer shadow-2xs"
              >
                <div className="relative h-11 w-11 rounded-lg overflow-hidden shrink-0 bg-[#DCE2C6]">
                  <Image
                    src={sample.imageUrl}
                    alt={sample.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#1C1917] dark:text-[#F5F2EC] truncate group-hover:text-[#E0623A] transition-colors">
                    {sample.name}
                  </p>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">
                    {sample.category} • {sample.colorName}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
