import type { SkillLevel, TerrainType } from "./snowboards";

export type { SkillLevel, TerrainType };

export type BudgetRange =
  | "under-300"
  | "300-500"
  | "500-700"
  | "700-1000"
  | "1000-plus";

export const BUDGET_RANGE_MAP: Record<BudgetRange, [number, number]> = {
  "under-300": [0, 300],
  "300-500": [300, 500],
  "500-700": [500, 700],
  "700-1000": [700, 1000],
  "1000-plus": [1000, 5000],
};

export const BUDGET_LABELS: Record<BudgetRange, string> = {
  "under-300": "Under $300",
  "300-500": "$300–$500",
  "500-700": "$500–$700",
  "700-1000": "$700–$1000",
  "1000-plus": "$1000+",
};

export interface GearFormData {
  heightCm: number;
  weightKg: number;
  bootSize: number;
  skill: SkillLevel;
  terrain: TerrainType;
  budget: BudgetRange;
  currentGear: string;
}

export interface EnhancedRecommendation {
  board: {
    id: string;
    name: string;
    brand: string;
    priceRange: { min: number; max: number };
    specs: {
      length: number[];
      shape: string;
      flex: string;
      camberProfile: string;
    };
    description: string;
  };
  score: number;
  matchReasons: string[];
  aiRationale: string;
  affiliateUrl: string;
  recommendedLength: number;
}

export interface StoredRecommendation {
  id: string;
  slug: string;
  inputs: GearFormData;
  recommendations: EnhancedRecommendation[];
  created_at: string;
}
