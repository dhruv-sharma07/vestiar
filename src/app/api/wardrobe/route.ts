import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // If database connection is not configured yet
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        source: "local-fallback",
        message: "DATABASE_URL not set in .env.local. Using local storage fallback.",
        items: [],
      });
    }

    const whereClause = userId ? { userId } : {};

    const items = await prisma.clothingItem.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      source: "database",
      count: items.length,
      items,
    });
  } catch (error: any) {
    console.error("GET /api/wardrobe error:", error);
    // Graceful fallback if database connection fails
    return NextResponse.json(
      {
        success: false,
        source: "local-fallback",
        error: error.message || "Failed to fetch from database",
        items: [],
      },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      imageUrl,
      category,
      subCategory,
      colorName,
      colorHex,
      brand,
      price,
      occasions,
      userId = "demo-user-1",
      userEmail = "guest@fitiq.local",
    } = body;

    if (!name || !imageUrl) {
      return NextResponse.json(
        { error: "Item name and imageUrl are required" },
        { status: 400 }
      );
    }

    // If database connection is not configured yet, return fallback success
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        source: "local-fallback",
        message: "Saved to local state (DATABASE_URL not yet configured)",
        item: {
          id: `local-${Date.now()}`,
          name,
          imageUrl,
          category: category || "tops",
          subCategory: subCategory || "Apparel",
          colorName: colorName || "Neutral",
          colorHex: colorHex || "#27272A",
          brand: brand || "Custom",
          price: Number(price) || 0,
          occasions: occasions || ["casual"],
        },
      });
    }

    // Ensure user exists (upsert)
    const user = await prisma.user.upsert({
      where: { email: userEmail },
      update: {},
      create: {
        id: userId,
        email: userEmail,
        name: userEmail.split("@")[0],
      },
    });

    // Create clothing item in database
    const createdItem = await prisma.clothingItem.create({
      data: {
        userId: user.id,
        name,
        imageUrl,
        category: category || "tops",
        type: subCategory || "Apparel",
        colors: [colorName || "Neutral"],
        colorHex: colorHex || "#27272A",
        brand: brand || "Custom",
        price: Number(price) || 0,
        occasions: occasions || ["casual"],
        season: "all-season",
        isClean: true,
        isFavorite: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        source: "database",
        item: createdItem,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/wardrobe error:", error);
    return NextResponse.json(
      {
        success: false,
        source: "local-fallback",
        error: error.message || "Failed to save item in database",
      },
      { status: 500 }
    );
  }
}
