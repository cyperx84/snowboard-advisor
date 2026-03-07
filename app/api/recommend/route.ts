import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getRecommendations, UserProfile, heightCmToFeetInches, weightKgToLbs } from '@/lib/recommendation-engine';
import { z } from 'zod';
import { trackRecommendation } from '@/lib/analytics';

const userProfileSchema = z.object({
  height: z.number().min(140).max(220),
  weight: z.number().min(40).max(150),
  bootSize: z.number().min(5).max(15),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  terrainPreference: z.enum(['all-mountain', 'freestyle', 'powder', 'carving']),
  budgetMin: z.number().min(0),
  budgetMax: z.number().min(0),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedProfile = userProfileSchema.parse(body);

    // Get recommendations
    const recommendations = getRecommendations(validatedProfile);

    if (recommendations.length === 0) {
      return NextResponse.json(
        { error: 'No boards found matching your criteria. Try adjusting your preferences.' },
        { status: 404 }
      );
    }

    // Generate AI rationale for each recommendation
    const enhancedRecommendations = await Promise.all(
      recommendations.map(async (rec) => {
        const rationale = await generateRationale(validatedProfile, rec);
        return {
          ...rec,
          aiRationale: rationale,
        };
      })
    );

    // Track analytics
    await trackRecommendation({
      profile: validatedProfile,
      timestamp: new Date().toISOString(),
      recommendationCount: enhancedRecommendations.length,
    });

    return NextResponse.json({
      recommendations: enhancedRecommendations,
      profile: validatedProfile,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Recommendation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

async function generateRationale(
  profile: UserProfile,
  recommendation: { board: any; matchReasons: string[] }
): Promise<string> {
  // If no OpenAI API key, return a default rationale
  if (!process.env.OPENAI_API_KEY) {
    return `The ${recommendation.board.name} is an excellent match because: ${recommendation.matchReasons.join(', ')}. ${recommendation.board.description}`;
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `You are a snowboard expert advisor. Generate a personalized, enthusiastic explanation (2-3 sentences) for why this board is recommended.

Rider Profile:
- Skill: ${profile.skillLevel}
- Height: ${heightCmToFeetInches(profile.height)} (${profile.height}cm)
- Weight: ${weightKgToLbs(profile.weight)}lbs (${profile.weight}kg)
- Boot Size: US ${profile.bootSize}
- Terrain: ${profile.terrainPreference}
- Budget: $${profile.budgetMin}-$${profile.budgetMax}

Board: ${recommendation.board.name} by ${recommendation.board.brand}
Price: $${recommendation.board.priceRange.min}-$${recommendation.board.priceRange.max}
${recommendation.board.description}
Flex: ${recommendation.board.specs.flex}
Shape: ${recommendation.board.specs.shape}
Camber: ${recommendation.board.specs.camberProfile}

Match reasons: ${recommendation.matchReasons.join(', ')}

Write a personalized explanation focusing on WHY this board fits their specific needs. Be conversational and engaging.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert snowboard advisor who gives personalized, enthusiastic recommendations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return completion.choices[0]?.message?.content || recommendation.matchReasons.join('. ') + '.';
  } catch (error) {
    console.error('OpenAI error:', error);
    // Fallback to basic rationale
    return `The ${recommendation.board.name} is an excellent match because: ${recommendation.matchReasons.join(', ')}. ${recommendation.board.description}`;
  }
}
