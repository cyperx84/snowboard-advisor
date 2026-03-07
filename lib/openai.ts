import OpenAI from "openai";
import type { UserProfile, ScoredRecommendation } from "./recommendation-engine";

const TERRAIN_LABELS: Record<string, string> = {
  "all-mountain": "all-mountain versatility",
  freestyle: "freestyle / park & pipe",
  powder: "powder / backcountry / off-piste",
  carving: "carving / groomed runs",
};

export async function generateAiRationale(
  profile: UserProfile,
  rec: ScoredRecommendation
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return `${rec.board.name} is an excellent match: ${rec.matchReasons.join(", ")}. ${rec.board.description}`;
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `You are a snowboard expert advisor. Write a personalized, enthusiastic 2–3 sentence explanation for why this board suits this specific rider.

Rider: ${profile.skillLevel}, ${profile.height}cm tall, ${profile.weight}kg, prefers ${TERRAIN_LABELS[profile.terrainPreference] ?? profile.terrainPreference}, budget $${profile.budgetMin}–$${profile.budgetMax}.
Board: ${rec.board.name} — ${rec.board.description}
Flex: ${rec.board.specs.flex}, Shape: ${rec.board.specs.shape}, Camber: ${rec.board.specs.camberProfile}
Match reasons: ${rec.matchReasons.join(", ")}

Be conversational and focus on WHY this board fits their specific needs.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });

    return (
      completion.choices[0]?.message?.content ??
      `${rec.board.name} is an excellent match: ${rec.matchReasons.join(", ")}.`
    );
  } catch {
    return `${rec.board.name} is an excellent match: ${rec.matchReasons.join(", ")}. ${rec.board.description}`;
  }
}
