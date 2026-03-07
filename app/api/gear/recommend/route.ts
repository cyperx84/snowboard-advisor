import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRecommendations, calculateBoardLength } from "@/lib/recommendation-engine";
import { generateAiRationale } from "@/lib/openai";
import { supabase } from "@/lib/supabase";
import { getAffiliateUrl } from "@/lib/avantlink";
import type { EnhancedRecommendation } from "@/lib/types";

const gearFormSchema = z.object({
  heightCm: z.number().min(140).max(220),
  weightKg: z.number().min(40).max(150),
  bootSize: z.number().min(5).max(15),
  skill: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  terrain: z.enum(["all-mountain", "freestyle", "powder", "carving"]),
  budget: z.enum(["under-300", "300-500", "500-700", "700-1000", "1000-plus"]),
  currentGear: z.string().max(200).default(""),
});

const BUDGET_MAP: Record<string, [number, number]> = {
  "under-300": [0, 300],
  "300-500": [300, 500],
  "500-700": [500, 700],
  "700-1000": [700, 1000],
  "1000-plus": [1000, 5000],
};

function generateSlug(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const inputs = gearFormSchema.parse(body);

    const [budgetMin, budgetMax] = BUDGET_MAP[inputs.budget];

    const profile = {
      height: inputs.heightCm,
      weight: inputs.weightKg,
      bootSize: inputs.bootSize,
      skillLevel: inputs.skill,
      terrainPreference: inputs.terrain,
      budgetMin,
      budgetMax,
    };

    const scored = getRecommendations(profile);

    if (scored.length === 0) {
      return NextResponse.json(
        { error: "No boards found for your criteria. Try widening your budget or skill level." },
        { status: 404 }
      );
    }

    // Enrich with AI rationale and affiliate links in parallel
    const enhanced: EnhancedRecommendation[] = await Promise.all(
      scored.map(async (rec) => {
        const aiRationale = await generateAiRationale(profile, rec);
        const searchQuery = `${rec.board.brand} ${rec.board.name} snowboard`;
        return {
          board: rec.board,
          score: rec.score,
          matchReasons: rec.matchReasons,
          aiRationale,
          affiliateUrl: getAffiliateUrl(searchQuery),
          recommendedLength: calculateBoardLength(
            inputs.heightCm,
            inputs.weightKg,
            inputs.skill
          ),
        };
      })
    );

    const slug = generateSlug();

    // Persist to Supabase (non-fatal if unavailable)
    const { error: dbError } = await supabase
      .from("recommendations")
      .insert({ slug, inputs, boards: enhanced });

    if (dbError) {
      console.error("Supabase insert error:", dbError.message);
      return NextResponse.json({ slug: null, boards: enhanced }, { status: 200 });
    }

    return NextResponse.json({ slug, boards: enhanced }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: err.issues },
        { status: 400 }
      );
    }
    console.error("Gear recommend error:", err);
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}
