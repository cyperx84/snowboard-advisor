import {
  getRecommendations,
  calculateBoardLength,
  type UserProfile,
} from "@/lib/recommendation-engine";

const BASE_PROFILE: UserProfile = {
  height: 175,
  weight: 75,
  bootSize: 10,
  skillLevel: "intermediate",
  terrainPreference: "all-mountain",
  budgetMin: 400,
  budgetMax: 700,
};

describe("calculateBoardLength", () => {
  it("returns a reasonable board length for an average rider", () => {
    const length = calculateBoardLength(175, 75, "intermediate");
    expect(length).toBeGreaterThan(150);
    expect(length).toBeLessThan(175);
  });

  it("returns shorter board for beginners vs experts", () => {
    const beginnerLength = calculateBoardLength(175, 75, "beginner");
    const expertLength = calculateBoardLength(175, 75, "expert");
    expect(beginnerLength).toBeLessThan(expertLength);
  });

  it("adds length for heavier riders", () => {
    const lightLength = calculateBoardLength(175, 55, "intermediate");
    const heavyLength = calculateBoardLength(175, 95, "intermediate");
    expect(heavyLength).toBeGreaterThan(lightLength);
  });
});

describe("getRecommendations", () => {
  it("returns up to 3 boards", () => {
    const results = getRecommendations(BASE_PROFILE);
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it("returns boards sorted by score descending", () => {
    const results = getRecommendations(BASE_PROFILE);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("each result has required fields", () => {
    const results = getRecommendations(BASE_PROFILE);
    for (const rec of results) {
      expect(rec.board).toBeDefined();
      expect(rec.board.name).toBeTruthy();
      expect(rec.score).toBeGreaterThan(0);
      expect(Array.isArray(rec.matchReasons)).toBe(true);
    }
  });

  it("handles expert powder rider within budget", () => {
    const powderExpert: UserProfile = {
      ...BASE_PROFILE,
      skillLevel: "expert",
      terrainPreference: "powder",
      budgetMin: 500,
      budgetMax: 1000,
    };
    const results = getRecommendations(powderExpert);
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it("handles very tight budget gracefully", () => {
    const tightBudget: UserProfile = { ...BASE_PROFILE, budgetMin: 0, budgetMax: 100 };
    const results = getRecommendations(tightBudget);
    expect(results.length).toBeLessThanOrEqual(3);
  });
});
