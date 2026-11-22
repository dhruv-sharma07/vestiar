import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

function getCloudinaryConfig() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    return { cloudName, apiKey, apiSecret, isConfigured: true };
  }
  return { isConfigured: false };
}

export async function GET() {
  const { isConfigured, cloudName } = getCloudinaryConfig();
  return NextResponse.json({
    success: true,
    isConfigured,
    provider: isConfigured ? "cloudinary" : "local-storage",
    cloudName: isConfigured ? cloudName : null,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { isConfigured } = getCloudinaryConfig();
    const contentType = request.headers.get("content-type") || "";

    let fileData: string = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      fileData = body.image || body.imageBase64 || "";
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      if (file) {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        fileData = `data:${file.type};base64,${base64}`;
      }
    }

    if (!fileData) {
      return NextResponse.json(
        { error: "No image file or base64 data provided" },
        { status: 400 }
      );
    }

    // If Cloudinary is configured, upload to CDN
    if (isConfigured) {
      const uploadResult = await cloudinary.uploader.upload(fileData, {
        folder: "fitiq-wardrobe",
        transformation: [
          { width: 1000, height: 1333, crop: "limit" }, // High quality 3:4 aspect ratio limit
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });

      return NextResponse.json({
        success: true,
        provider: "cloudinary",
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        bytes: uploadResult.bytes,
        format: uploadResult.format,
      });
    }

    // Fallback: Return image data directly so user experience is immediate without external setup
    return NextResponse.json({
      success: true,
      provider: "direct-storage",
      message:
        "Cloudinary not configured in .env.local. Stored image directly in local payload.",
      url: fileData,
    });
  } catch (error: any) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}
