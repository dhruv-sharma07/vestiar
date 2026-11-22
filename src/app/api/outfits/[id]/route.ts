import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (prisma) {
      await prisma.outfit.delete({
        where: { id },
      });
      return NextResponse.json({
        success: true,
        source: "database",
        message: "Outfit removed",
      });
    }

    return NextResponse.json({
      success: true,
      source: "local-fallback",
      message: "Outfit removed from local state",
    });
  } catch (error: any) {
    console.error("Error deleting outfit:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete outfit" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (prisma) {
      const updated = await prisma.outfit.update({
        where: { id },
        data: {
          ...(typeof body.isLiked === "boolean" ? { isLiked: body.isLiked } : {}),
          ...(body.title ? { title: body.title } : {}),
          ...(body.aiReasoning ? { aiReasoning: body.aiReasoning } : {}),
        },
      });

      return NextResponse.json({
        success: true,
        source: "database",
        outfit: updated,
      });
    }

    return NextResponse.json({
      success: true,
      source: "local-fallback",
      outfit: { id, ...body },
    });
  } catch (error: any) {
    console.error("Error updating outfit:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update outfit" },
      { status: 500 }
    );
  }
}
