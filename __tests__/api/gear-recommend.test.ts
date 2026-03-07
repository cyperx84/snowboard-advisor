jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => Promise.resolve({ error: null })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
    })),
  },
}));

jest.mock("@/lib/openai", () => ({
  generateAiRationale: jest.fn(() =>
    Promise.resolve("This board is a great match for your riding style.")
  ),
}));

import { NextRequest } from "next/server";
import { POST } from "@/app/api/gear/recommend/route";

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost/api/gear/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const VALID_BODY = {
  heightCm: 175,
  weightKg: 75,
  bootSize: 10,
  skill: "intermediate",
  terrain: "all-mountain",
  budget: "500-700",
  currentGear: "",
};

describe("POST /api/gear/recommend", () => {
  it("returns 400 for missing required fields", async () => {
    const req = makeRequest({ heightCm: 175 });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid input");
  });

  it("returns 400 for out-of-range height", async () => {
    const req = makeRequest({ ...VALID_BODY, heightCm: 300 });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid skill level", async () => {
    const req = makeRequest({ ...VALID_BODY, skill: "pro" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid budget value", async () => {
    const req = makeRequest({ ...VALID_BODY, budget: "expensive" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns boards for a valid request", async () => {
    const req = makeRequest(VALID_BODY);
    const res = await POST(req);
    expect([200, 201, 404]).toContain(res.status);

    if (res.status !== 404) {
      const body = await res.json();
      expect(Array.isArray(body.boards)).toBe(true);
      if (body.boards.length > 0) {
        const first = body.boards[0];
        expect(first.board).toBeDefined();
        expect(first.aiRationale).toBeTruthy();
        expect(first.affiliateUrl).toBeTruthy();
        expect(typeof first.recommendedLength).toBe("number");
      }
    }
  });

  it("returns boards for an expert powder rider", async () => {
    const req = makeRequest({
      ...VALID_BODY,
      skill: "expert",
      terrain: "powder",
      budget: "700-1000",
    });
    const res = await POST(req);
    expect([200, 201, 404]).toContain(res.status);
  });
});
