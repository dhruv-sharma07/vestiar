# VESTIAR

> Atelier de Garde-Robe Privée &bull; Occasion Dressing

An editorial digital wardrobe salon engineered for high-tactility garment cataloging, color harmony pairing, and occasion-based silhouette curation.

---

## Technical Architecture

- **Framework**: Next.js 16 (App Router, React 19)
- **Styling**: Tailwind CSS v4 with dual-palette token architecture (Warm Alabaster Light / Obsidian Noir Dark)
- **3D Physics & Motion**: Framer Motion with perspective transforms, spring damping, and inertial cursor tracking
- **Showcase Engine**: WebGL 3D Circular Gallery via OGL
- **Data Layer**: Supabase PostgreSQL with Prisma ORM
- **Media Asset Pipeline**: Cloudinary CDN with automated delivery optimization
- **Vision Classification**: Google Gemini Vision API for multimodal silhouette, fabric, and palette auto-tagging

---

## Core Capabilities

1. **Theatrical 3D Wardrobe Entrance**
   - Double-door armoire swinging physics (`rotateY` perspective) with autonomous 2-second timing and diagonal light slash reveal.

2. **Interactive 3D Hovering Canvas**
   - Real-time cursor-tracking particle field with depth projection (`FOV / (FOV + z)`) and living ambient mesh orbs.

3. **Occasion Direction Engine**
   - Harmonious pairing algorithms across Gym, Work, Evening, and Casual occasions, incorporating real-time weather and palette coherence.

4. **3D Inertia Garment Showcase**
   - WebGL cylinder mesh for browsing wardrobe items with touch and wheel inertia.

5. **Multimodal Garment Digitization**
   - Drag-and-drop image analysis extracting garment category, primary palette hex, fabric weight, and occasion suitability.

---

## Local Development

### Prerequisites
- Node.js 20+
- npm or pnpm

### Setup
```bash
git clone <your-repo-url>
cd wardrobe-ai
npm install
```

### Environment Configuration
Create a `.env.local` file with your credentials:
```env
DATABASE_URL="your-postgresql-connection-string"
DIRECT_URL="your-direct-connection-string"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
GEMINI_API_KEY="your-gemini-api-key"
```

### Run Locally
```bash
npm run dev
# or for optimized production build:
npm run build && npm run start
```

---

## License

Released under the MIT License. Copyright (c) 2026 Dhruv Sharma.
