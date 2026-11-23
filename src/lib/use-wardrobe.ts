"use client";

import { useState, useEffect, useCallback } from "react";
import { CuratedItem, SAMPLE_FOUR_ITEMS, formatRupees } from "@/lib/curated-wardrobe";

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

const STORAGE_KEY_ITEMS = "vestiar_closet_items";
const STORAGE_KEY_USER = "vestiar_user";

// Helper for pastel badge resolution
function getPastelTag(category: string) {
  switch (category) {
    case "tops":
      return {
        bg: "bg-[#E8EEE7]",
        text: "text-[#2D4A34]",
        border: "border-[#D1DFD0]",
      };
    case "bottoms":
      return {
        bg: "bg-[#F3EFEA]",
        text: "text-[#5C5349]",
        border: "border-[#E4DCD2]",
      };
    case "footwear":
      return {
        bg: "bg-[#E8EEE7]",
        text: "text-[#2D4A34]",
        border: "border-[#D1DFD0]",
      };
    case "outerwear":
      return {
        bg: "bg-[#FDF8ED]",
        text: "text-[#7B6127]",
        border: "border-[#E8D9B9]",
      };
    case "accessories":
      return {
        bg: "bg-[#F5F0EB]",
        text: "text-[#6B4F3A]",
        border: "border-[#E5DCD2]",
      };
    default:
      return {
        bg: "bg-[#FDF8ED]",
        text: "text-[#7B6127]",
        border: "border-[#E8D9B9]",
      };
  }
}

export function useWardrobe() {
  const [items, setItems] = useState<CuratedItem[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isSampleActive, setIsSampleActive] = useState(false);
  const [dbSource, setDbSource] = useState<"database" | "local-fallback">("local-fallback");
  const [isCloudinaryActive, setIsCloudinaryActive] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage and backend API
  useEffect(() => {
    // 1. Initial sync from localStorage (instant, prevents hydration flicker)
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY_ITEMS) || localStorage.getItem("fitiq_closet_items");
      if (savedItems) {
        const parsed = JSON.parse(savedItems);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }
      const savedUser = localStorage.getItem(STORAGE_KEY_USER) || localStorage.getItem("fitiq_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.warn("Local storage read error:", e);
    }

    // 2. Sync from backend API
    async function fetchBackendWardrobe() {
      try {
        const res = await fetch("/api/wardrobe");
        const data = await res.json();
        if (data.success && data.source === "database") {
          setDbSource("database");
          if (Array.isArray(data.items) && data.items.length > 0) {
            const dbItems: CuratedItem[] = data.items.map((dbItem: any) => ({
              id: dbItem.id,
              name: dbItem.name,
              category: dbItem.category,
              subCategory: dbItem.type || "Apparel",
              colorName: dbItem.colors?.[0] || "Neutral",
              colorHex: dbItem.colorHex || "#27272A",
              brand: dbItem.brand || "Custom",
              price: dbItem.price || 0,
              imageUrl: dbItem.imageUrl,
              pastelTag: getPastelTag(dbItem.category),
              occasions: dbItem.occasions || ["casual"],
            }));
            setItems(dbItems);
            setIsSampleActive(false);
          }
        }
      } catch (err) {
        console.log("Local storage fallback in effect:", err);
      } finally {
        setIsInitialized(true);
      }

      // Check Cloudinary
      try {
        const upRes = await fetch("/api/upload");
        const upData = await upRes.json();
        if (upData.isConfigured) {
          setIsCloudinaryActive(true);
        }
      } catch (e) {}
    }

    fetchBackendWardrobe();
  }, []);

  // Listen for storage events across tabs or routes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_ITEMS && e.newValue) {
        try {
          setItems(JSON.parse(e.newValue));
        } catch (err) {}
      }
      if (e.key === STORAGE_KEY_USER) {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch (err) {}
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save items helper
  const persistItems = useCallback((newItems: CuratedItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(newItems));
      localStorage.setItem("fitiq_closet_items", JSON.stringify(newItems));
    } catch (e) {}
  }, []);

  // Add Item
  const addItem = useCallback(
    async (newItem: CuratedItem) => {
      const updated = [newItem, ...items];
      persistItems(updated);
      setIsSampleActive(false);

      // Backend sync
      try {
        const res = await fetch("/api/wardrobe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newItem.name,
            imageUrl: newItem.imageUrl,
            category: newItem.category,
            subCategory: newItem.subCategory,
            colorName: newItem.colorName,
            colorHex: newItem.colorHex,
            brand: newItem.brand,
            price: newItem.price,
            occasions: newItem.occasions,
            userId: user?.email || "demo-user-1",
            userEmail: user?.email || "guest@fitiq.local",
          }),
        });
        const data = await res.json();
        if (data.source === "database") {
          setDbSource("database");
        }
      } catch (e) {
        console.log("Saved locally (offline mode)");
      }
    },
    [items, persistItems, user]
  );

  // Remove Item
  const removeItem = useCallback(
    async (id: string) => {
      const updated = items.filter((i) => i.id !== id);
      persistItems(updated);

      try {
        await fetch(`/api/wardrobe/${id}`, { method: "DELETE" });
      } catch (e) {
        console.log("Deleted locally");
      }
    },
    [items, persistItems]
  );

  // Load Samples
  const loadSamples = useCallback(() => {
    persistItems(SAMPLE_FOUR_ITEMS);
    setIsSampleActive(true);
  }, [persistItems]);

  // Clear Samples
  const clearSamples = useCallback(() => {
    persistItems([]);
    setIsSampleActive(false);
  }, [persistItems]);

  // Login handler
  const login = useCallback((userData: UserProfile) => {
    setUser(userData);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
      localStorage.setItem("fitiq_user", JSON.stringify(userData));
    } catch (e) {}
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem("fitiq_user");
    } catch (e) {}
  }, []);

  return {
    items,
    user,
    isSampleActive,
    dbSource,
    isCloudinaryActive,
    isInitialized,
    addItem,
    removeItem,
    loadSamples,
    clearSamples,
    login,
    logout,
    formatRupees,
  };
}
