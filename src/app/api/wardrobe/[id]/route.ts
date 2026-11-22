import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    // If database connection is not configured yet
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        source: "local-fallback",
        message: "Deleted from local state (DATABASE_URL not set)",
        id,
      });
    }

    await prisma.clothingItem.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      source: "database",
      message: "Item deleted successfully",
      id,
    });
  } catch (error: any) {
    console.error("DELETE /api/wardrobe/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        source: "local-fallback",
        error: error.message || "Failed to delete item from database",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        source: "local-fallback",
        id,
        updated: body,
      });
    }

    const updated = await prisma.clothingItem.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      source: "database",
      item: updated,
    });
  } catch (error: any) {
    console.error("PATCH /api/wardrobe/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        source: "local-fallback",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
