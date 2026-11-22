import { NextRequest, NextResponse } from "next/server";
import { POST as tagClothingPost } from "../tag-clothing/route";

// Forward directly to tag-clothing route handler
export async function POST(request: NextRequest) {
  return tagClothingPost(request);
}
