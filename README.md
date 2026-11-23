# Wardrobe AI

A smart digital wardrobe web application that helps you organize your clothing collection and automatically pairs outfits for any occasion using multimodal AI.

---

## What It Does

1. **Upload & Catalog**: Add photos of your clothes. The system extracts the garment category, sub-category, color palette, and fabric profile automatically.
2. **Occasion & Weather Pairing**: Select an event (Work, Gym, Evening, Weekend Casual) and current weather to receive coordinated combinations from your actual wardrobe.
3. **Head-to-Toe View**: Displays your matched ensemble in natural body order (accessories, top layers, bottoms, and footwear) so you can review color balance and styling details.
4. **Interactive Digital Closet**: Browse your catalog in a clean grid layout or an interactive curved carousel.
5. **Trip Capsule & Lookbook**: Save favorite combinations or assemble packing lists for upcoming travel.

---

## Technical Stack

- **Framework**: Next.js 16 (App Router)
- **UI & Styling**: React 19, Tailwind CSS v4, Lucide Icons
- **AI Engine**: Google Gemini API (Multimodal Vision & Outfit Engine)
- **Database & Storage**: Supabase PostgreSQL with Prisma ORM, Cloudinary CDN
- **Animation**: Framer Motion, OGL WebGL

---

## Quickstart

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your keys:
- `DATABASE_URL`: PostgreSQL connection string (Supabase)
- `CLOUDINARY_URL`: Cloudinary credentials for image storage
- `GEMINI_API_KEY`: Google Gemini API key

### 3. Run Development Server
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## License

MIT License - Copyright (c) 2026 Dhruv Sharma.
