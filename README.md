# Snowboard Advisor - AI-Powered Gear Recommendations

An intelligent snowboard recommendation system that helps riders find their perfect board based on their profile, skill level, and riding preferences.

## Features

- **Smart Input Form**: Collects height, weight, boot size, skill level, terrain preference, and budget
- **AI-Powered Recommendations**: Rules-based matching with OpenAI-generated personalized explanations
- **Top 3 Recommendations**: Shows the best snowboards with detailed specs and rationale
- **Shareable Results**: Every recommendation has a unique URL that can be shared
- **Basic Analytics**: Tracks recommendation requests (stored locally in JSON)
- **Production-Ready UI**: Clean, minimal design with snow/mountain theme using shadcn/ui

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **AI**: OpenAI API (optional - graceful fallback)
- **TypeScript**: Full type safety
- **Validation**: Zod

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key (optional):
```
OPENAI_API_KEY=your_api_key_here
```

**Note**: The app works without an OpenAI API key by using fallback recommendations.

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## How It Works

### 1. User Input
Form collects rider profile: height, weight, boot size, skill level, terrain preference, budget

### 2. Recommendation Engine
Rules-based scoring on:
- Skill level match (40 pts)
- Terrain compatibility (30 pts)
- Budget fit (20 pts)
- Board length appropriateness (10 pts)

### 3. AI Enhancement
Optional OpenAI integration generates personalized explanations for each recommendation

### 4. Shareable Results
Results loaded via query params - shareable URLs

### 5. Analytics
File-based tracking of requests, skill levels, terrain preferences, budgets

## Project Structure

```
snowboard-advisor/
├── app/
│   ├── api/recommend/route.ts    # Recommendation API
│   ├── results/                  # Results page
│   └── page.tsx                  # Home with form
├── components/
│   ├── ui/                       # shadcn components
│   └── recommendation-form.tsx   # Input form
└── lib/
    ├── snowboards.ts             # Board database
    ├── recommendation-engine.ts  # Matching logic
    └── analytics.ts              # Tracking

```

## Deployment

Deploy to [Vercel](https://vercel.com) (recommended) or any Next.js-compatible platform.

Add `OPENAI_API_KEY` as an environment variable if using AI rationale.
