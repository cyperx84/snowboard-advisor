"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { BudgetRange } from "@/lib/types";

type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";
type TerrainType = "all-mountain" | "freestyle" | "powder" | "carving";

interface FormData {
  heightCm: string;
  weightKg: string;
  bootSize: string;
  skill: SkillLevel | "";
  terrain: TerrainType | "";
  budget: BudgetRange | "";
  currentGear: string;
}

const STEPS = [
  { id: 1, title: "About You", description: "Your physical measurements" },
  { id: 2, title: "Your Riding Style", description: "How and where you ride" },
  {
    id: 3,
    title: "Budget & Experience",
    description: "What you can spend and what you ride now",
  },
];

const BUDGET_MAP: Record<BudgetRange, [number, number]> = {
  "under-300": [0, 300],
  "300-500": [300, 500],
  "500-700": [500, 700],
  "700-1000": [700, 1000],
  "1000-plus": [1000, 5000],
};

const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: "under-300", label: "Under $300" },
  { value: "300-500", label: "$300–$500" },
  { value: "500-700", label: "$500–$700" },
  { value: "700-1000", label: "$700–$1000" },
  { value: "1000-plus", label: "$1000+" },
];

const TERRAIN_OPTIONS: {
  value: TerrainType;
  label: string;
  description: string;
}[] = [
  {
    value: "all-mountain",
    label: "All-Mountain",
    description: "Groomers, trees, and everything in between",
  },
  {
    value: "freestyle",
    label: "Freestyle / Park",
    description: "Jumps, rails, and park features",
  },
  {
    value: "powder",
    label: "Powder / Backcountry",
    description: "Deep days and off-piste adventures",
  },
  {
    value: "carving",
    label: "Carving",
    description: "High-speed groomed run precision",
  },
];

const SKILL_OPTIONS: {
  value: SkillLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "beginner",
    label: "Beginner",
    description: "Still learning turns and stopping",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Comfortable on most runs",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Confident on blacks and all conditions",
  },
  {
    value: "expert",
    label: "Expert",
    description: "Charging anything, anywhere",
  },
];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8 flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
              step < current && "bg-primary text-primary-foreground",
              step === current &&
                "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
              step > current && "bg-muted text-muted-foreground"
            )}
          >
            {step < current ? "✓" : step}
          </div>
          {step < total && (
            <div
              className={cn(
                "h-0.5 w-12 transition-colors sm:w-20",
                step < current ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function SelectionCard({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border-2 p-4 text-left transition-all",
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      )}
    >
      <div className="text-sm font-semibold">{label}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{description}</div>
    </button>
  );
}

export default function GearPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    heightCm: "",
    weightKg: "",
    bootSize: "",
    skill: "",
    terrain: "",
    budget: "",
    currentGear: "",
  });

  function update(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function isStep1Valid() {
    return (
      Number(formData.heightCm) >= 140 &&
      Number(formData.heightCm) <= 220 &&
      Number(formData.weightKg) >= 40 &&
      Number(formData.weightKg) <= 150 &&
      Number(formData.bootSize) >= 5 &&
      Number(formData.bootSize) <= 15
    );
  }

  function isStep2Valid() {
    return formData.skill !== "" && formData.terrain !== "";
  }

  function isStep3Valid() {
    return formData.budget !== "";
  }

  function handleNext() {
    setError(null);
    if (step === 1 && !isStep1Valid()) {
      setError("Please fill in all measurements with valid values.");
      return;
    }
    if (step === 2 && !isStep2Valid()) {
      setError("Please select your skill level and terrain preference.");
      return;
    }
    setStep((s) => s + 1);
  }

  async function handleSubmit() {
    if (!isStep3Valid()) {
      setError("Please select a budget range.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/gear/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heightCm: Number(formData.heightCm),
          weightKg: Number(formData.weightKg),
          bootSize: Number(formData.bootSize),
          skill: formData.skill,
          terrain: formData.terrain,
          budget: formData.budget,
          currentGear: formData.currentGear,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      if (data.slug) {
        router.push(`/gear/${data.slug}`);
      } else {
        // Supabase unavailable — fall back to existing results page
        const budget = formData.budget as BudgetRange;
        router.push(
          `/results?${new URLSearchParams({
            height: formData.heightCm,
            weight: formData.weightKg,
            bootSize: formData.bootSize,
            skillLevel: formData.skill,
            terrainPreference: formData.terrain,
            budgetMin: String(BUDGET_MAP[budget][0]),
            budgetMax: String(BUDGET_MAP[budget][1]),
          })}`
        );
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  const currentStep = STEPS[step - 1];

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Gear Advisor
          </h1>
          <p className="mt-2 text-muted-foreground">
            Answer a few questions and we&apos;ll recommend the perfect board
            for you.
          </p>
        </div>

        <StepIndicator current={step} total={STEPS.length} />

        <Card>
          <CardHeader>
            <CardTitle>{currentStep.title}</CardTitle>
            <CardDescription>{currentStep.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    inputMode="decimal"
                    placeholder="175"
                    min="140"
                    max="220"
                    value={formData.heightCm}
                    onChange={(e) => update("heightCm", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    inputMode="decimal"
                    placeholder="70"
                    min="40"
                    max="150"
                    value={formData.weightKg}
                    onChange={(e) => update("weightKg", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="boot">Boot Size (US)</Label>
                  <Input
                    id="boot"
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    placeholder="10"
                    min="5"
                    max="15"
                    value={formData.bootSize}
                    onChange={(e) => update("bootSize", e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Skill Level</Label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {SKILL_OPTIONS.map((opt) => (
                      <SelectionCard
                        key={opt.value}
                        label={opt.label}
                        description={opt.description}
                        selected={formData.skill === opt.value}
                        onClick={() => update("skill", opt.value)}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Terrain</Label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {TERRAIN_OPTIONS.map((opt) => (
                      <SelectionCard
                        key={opt.value}
                        label={opt.label}
                        description={opt.description}
                        selected={formData.terrain === opt.value}
                        onClick={() => update("terrain", opt.value)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range (USD)</Label>
                  <Select
                    value={formData.budget}
                    onValueChange={(v) => v != null && update("budget", v)}
                  >
                    <SelectTrigger id="budget">
                      <SelectValue placeholder="Select your budget" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentGear">
                    Current Board{" "}
                    <span className="text-xs text-muted-foreground">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="currentGear"
                    placeholder="e.g. Burton Ripcord 154, or leave blank"
                    value={formData.currentGear}
                    onChange={(e) => update("currentGear", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Helps us understand what you&apos;re upgrading from.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              {step > 1 ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep((s) => s - 1);
                    setError(null);
                  }}
                  disabled={loading}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < STEPS.length ? (
                <Button onClick={handleNext}>Continue</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Finding your board…" : "Get Recommendations"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
