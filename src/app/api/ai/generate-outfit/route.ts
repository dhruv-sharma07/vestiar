import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { SAMPLE_FOUR_ITEMS, CuratedItem } from "@/lib/curated-wardrobe";

const GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
  "gemini-flash-latest",
];

async function callWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      occasion = "casual",
      weather = "mild",
      userId = "demo-user-1",
      userEmail,
      items: clientItems = [],
    } = body;

    let availableClothes: any[] = [];

    // 1. Query matching clothes from Supabase PostgreSQL
    if (prisma) {
      try {
        const queryCondition = userEmail
          ? {
              OR: [
                { user: { email: userEmail } },
                { userId: userEmail },
              ],
            }
          : {};

        const dbItems = await prisma.clothingItem.findMany({
          where: queryCondition,
          orderBy: { createdAt: "desc" },
        });

        if (dbItems && dbItems.length > 0) {
          availableClothes = dbItems.map((dbItem) => ({
            id: dbItem.id,
            name: dbItem.name,
            category: dbItem.category,
            type: dbItem.type,
            colorName: dbItem.colors?.[0] || "Neutral",
            colorHex: dbItem.colorHex || "#27272A",
            brand: dbItem.brand || "Curated",
            price: dbItem.price || 50,
            imageUrl: dbItem.imageUrl,
            occasions: dbItem.occasions || ["casual"],
            season: dbItem.season,
          }));
        }
      } catch (dbError) {
        console.warn("Could not query clothes from Supabase:", dbError);
      }
    }

    // Fallback to client-provided items or sample pieces if DB is empty
    if (availableClothes.length === 0) {
      availableClothes = clientItems.length > 0 ? clientItems : SAMPLE_FOUR_ITEMS;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 2. Query Gemini Generative AI Stylist if API Key exists
    if (apiKey && availableClothes.length >= 2) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);

        const simplifiedInventory = availableClothes.map((c) => ({
          id: c.id,
          name: c.name,
          category: c.category,
          color: c.colorName,
          hex: c.colorHex,
          brand: c.brand,
          occasions: c.occasions,
        }));

        const prompt = `You are an elite European luxury fashion stylist and creative director.
Target Occasion: "${occasion.toUpperCase()}"
Weather: "${weather}"

Here is the user's current closet inventory:
${JSON.stringify(simplifiedInventory, null, 2)}

Pair the single best combination (1 top, 1 bottom, 1 footwear if available, and 1 outerwear if weather is crisp/rainy or fits the style).
Explain the silhouette balance, color harmony, and styling rationale.

Return ONLY a valid raw JSON object (no markdown, no code block fences):
{
  "title": "Evocative, editorial outfit name (e.g. Understated European Tailored Evening)",
  "tagline": "A sharp, one-line summary of the aesthetic vibe",
  "selectedItemIds": ["id1", "id2", ...],
  "palette": ["#hex1", "#hex2", "#hex3"],
  "matchScore": 97,
  "stylistExplanation": "Detailed 2-sentence rationale on why these specific colors, proportions, and textures pair harmoniously for this occasion.",
  "weatherTip": "One sentence on thermal and layer comfort for ${weather} weather."
}`;

        for (const modelName of GEMINI_MODELS) {
          try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await callWithTimeout(model.generateContent(prompt), 6000);
            const text = result.response.text().trim();

            const cleanedJson = text
              .replace(/^```json\s*/i, "")
              .replace(/^```\s*/i, "")
              .replace(/\s*```$/, "")
              .trim();

            const parsed = JSON.parse(cleanedJson);

            // Map selectedItemIds back to full clothing objects
            let pairedItems = (parsed.selectedItemIds || [])
              .map((id: string) => availableClothes.find((c) => c.id === id))
              .filter(Boolean);

            if (pairedItems.length === 0) {
              pairedItems = availableClothes.slice(0, 3);
            }

            return NextResponse.json({
              success: true,
              source: `gemini-stylist (${modelName})`,
              occasion,
              weather,
              outfit: {
                title: parsed.title || "Curated Editorial Outfit",
                tagline: parsed.tagline || "Balanced minimalist tailoring.",
                matchScore: Number(parsed.matchScore) || 96,
                palette: parsed.palette || pairedItems.map((p: any) => p.colorHex).filter(Boolean),
                stylistExplanation: parsed.stylistExplanation,
                weatherTip: parsed.weatherTip,
                items: pairedItems,
              },
            });
          } catch (modelError: any) {
            console.warn(`Gemini model ${modelName} stylist failed:`, modelError.message);
          }
        }
      } catch (geminiError: any) {
        console.warn("Gemini outfit generator error:", geminiError);
      }
    }

    // 3. Fallback Heuristic Pairing Engine
    const tops = availableClothes.filter((i) => i.category === "tops");
    const bottoms = availableClothes.filter((i) => i.category === "bottoms");
    const footwear = availableClothes.filter((i) => i.category === "footwear");
    const outerwear = availableClothes.filter((i) => i.category === "outerwear");

    const top = tops.find((t) => t.occasions?.includes(occasion)) || tops[0] || availableClothes[0];
    const bottom = bottoms.find((b) => b.occasions?.includes(occasion)) || bottoms[0] || availableClothes[1] || top;
    const shoe = footwear.find((f) => f.occasions?.includes(occasion)) || footwear[0];
    const outer = weather === "crisp" || weather === "rainy" ? outerwear[0] : undefined;

    const paired = [top, bottom, shoe, outer].filter(Boolean);

    const HEURISTIC_DATA = {
      gym: {
        title: "Lightweight High-Mobility Set",
        tagline: "Engineered for training, breathable movement & cool comfort.",
        explanation: "Breathable airy upper paired with flexible ergonomic bottoms. Neutral trainers ground the athletic silhouette with effortless balance.",
        weatherTip: "Breathable natural fabrics keep your core cool during intense movement.",
        score: 98,
      },
      work: {
        title: "Refined Modern Tailored Smart-Casual",
        tagline: "Polished for meetings, creative studios, and professional presentations.",
        explanation: "Clean, structured silhouette with high-contrast proportions. Minimalist footwear anchors the look with quiet luxury understatement.",
        weatherTip: "Comfortable indoor-outdoor transition weight.",
        score: 96,
      },
      party: {
        title: "Understated Evening Monochrome",
        tagline: "Relaxed European nightlife tailoring with subtle texture.",
        explanation: "Soft drape layering anchored by refined footwear. Unbutton collar slightly for an effortless, confident twilight aesthetic.",
        weatherTip: "Comfortable for evening dining and dynamic indoor spaces.",
        score: 95,
      },
      casual: {
        title: "Weekend Gallery Stroll & Espresso",
        tagline: "Understated neutrals with architectural utility layers.",
        explanation: "Chalk white essentials elevated by subtle earthy tones, grounded by relaxed trousers and pristine court sneakers.",
        weatherTip: "Lightweight layering designed for pleasant day outings.",
        score: 97,
      },
    }[occasion as "gym" | "work" | "party" | "casual"] || {
      title: "Versatile Daily Ensemble",
      tagline: "Effortless everyday pairing.",
      explanation: "Balanced textures and clean proportions.",
      weatherTip: "Versatile all-season layering.",
      score: 95,
    };

    return NextResponse.json({
      success: true,
      source: "heuristic-stylist",
      occasion,
      weather,
      outfit: {
        title: HEURISTIC_DATA.title,
        tagline: HEURISTIC_DATA.tagline,
        matchScore: HEURISTIC_DATA.score,
        palette: paired.map((p) => p.colorHex || "#333333").slice(0, 4),
        stylistExplanation: HEURISTIC_DATA.explanation,
        weatherTip: HEURISTIC_DATA.weatherTip,
        items: paired,
      },
    });
  } catch (error: any) {
    console.error("Generate Outfit Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate outfit" },
      { status: 500 }
    );
  }
}
