import { SNOWBOARDS, Snowboard, SkillLevel, TerrainType } from './snowboards';

export interface UserProfile {
  height: number; // in cm
  weight: number; // in kg
  bootSize: number; // US size
  skillLevel: SkillLevel;
  terrainPreference: TerrainType;
  budgetMin: number;
  budgetMax: number;
}

export interface ScoredRecommendation {
  board: Snowboard;
  score: number;
  matchReasons: string[];
}

export function getRecommendations(profile: UserProfile): ScoredRecommendation[] {
  const scoredBoards = SNOWBOARDS.map((board) => {
    let score = 0;
    const matchReasons: string[] = [];

    // Skill level match (critical factor - 40 points max)
    if (board.skillLevels.includes(profile.skillLevel)) {
      score += 40;
      matchReasons.push(`Perfect for ${profile.skillLevel} riders`);
    } else {
      // Check if it's close (one level off)
      const skillLevelOrder: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
      const userSkillIndex = skillLevelOrder.indexOf(profile.skillLevel);
      const boardSkillIndexes = board.skillLevels.map((level) => skillLevelOrder.indexOf(level));
      const closestMatch = Math.min(...boardSkillIndexes.map((idx) => Math.abs(idx - userSkillIndex)));

      if (closestMatch === 1) {
        score += 20;
        matchReasons.push(`Suitable for progression from ${profile.skillLevel}`);
      }
    }

    // Terrain match (30 points max)
    if (board.terrainTypes.includes(profile.terrainPreference)) {
      score += 30;
      matchReasons.push(`Optimized for ${profile.terrainPreference}`);
    } else if (board.terrainTypes.includes('all-mountain')) {
      score += 15;
      matchReasons.push('Versatile all-mountain option');
    }

    // Budget match (20 points max)
    if (board.priceRange.min >= profile.budgetMin && board.priceRange.max <= profile.budgetMax) {
      score += 20;
      matchReasons.push('Within your budget');
    } else if (
      (board.priceRange.min <= profile.budgetMax && board.priceRange.max >= profile.budgetMin)
    ) {
      // Partial budget overlap
      score += 10;
      matchReasons.push('Partially within budget range');
    }

    // Board length recommendation based on height and weight (10 points)
    const recommendedLength = calculateBoardLength(profile.height, profile.weight, profile.skillLevel);
    const hasAppropriateLength = board.specs.length.some(
      (length) => Math.abs(length - recommendedLength) <= 4
    );
    if (hasAppropriateLength) {
      score += 10;
      matchReasons.push(`Available in appropriate length (${recommendedLength}cm recommended)`);
    }

    return {
      board,
      score,
      matchReasons,
    };
  });

  // Filter out boards with very low scores and sort by score
  return scoredBoards
    .filter((rec) => rec.score >= 30) // Minimum threshold
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Top 3 recommendations
}

export function calculateBoardLength(height: number, weight: number, skillLevel: SkillLevel): number {
  // Base length from height (cm to snowboard length)
  let baseLength = height - 15;

  // Adjust for weight
  if (weight > 90) {
    baseLength += 3;
  } else if (weight < 60) {
    baseLength -= 3;
  }

  // Adjust for skill level
  if (skillLevel === 'beginner') {
    baseLength -= 3; // Shorter for easier turning
  } else if (skillLevel === 'expert') {
    baseLength += 2; // Longer for stability at speed
  }

  return Math.round(baseLength);
}

export function heightCmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

export function weightKgToLbs(kg: number): number {
  return Math.round(kg * 2.20462);
}
