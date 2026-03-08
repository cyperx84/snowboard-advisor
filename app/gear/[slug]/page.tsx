import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { EnhancedRecommendation, StoredRecommendation } from "@/lib/types";
import { BUDGET_LABELS } from "@/lib/types";
import ShareButton from "./share-button";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getRecommendation(slug: string): Promise<StoredRecommendation | null> {
  const { data, error } = await supabase
    .from("recommendations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    slug: data.slug,
    inputs: data.inputs as StoredRecommendation["inputs"],
    recommendations: data.boards as EnhancedRecommendation[],
    created_at: data.created_at,
  };
}

function BoardCard({ rec, rank }: { rec: EnhancedRecommendation; rank: number }) {
  const priceLabel =
    rec.board.priceRange.min === rec.board.priceRange.max
      ? `$${rec.board.priceRange.min}`
      : `$${rec.board.priceRange.min}–$${rec.board.priceRange.max}`;

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            {rank}
          </span>
          <div>
            <h2 className="font-bold text-lg leading-tight">{rec.board.name}</h2>
            <p className="text-sm text-muted-foreground">{rec.board.brand}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-md bg-muted px-2.5 py-1 text-sm font-semibold">
          {priceLabel}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed">{rec.aiRationale}</p>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div>
          <span className="text-muted-foreground">Shape</span>
          <p className="font-medium">{rec.board.specs.shape}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Flex</span>
          <p className="font-medium">{rec.board.specs.flex}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Camber</span>
          <p className="font-medium">{rec.board.specs.camberProfile}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Recommended Length</span>
          <p className="font-medium">{rec.recommendedLength} cm</p>
        </div>
      </div>

      {rec.matchReasons.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {rec.matchReasons.map((reason) => (
            <span
              key={reason}
              className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary font-medium"
            >
              {reason}
            </span>
          ))}
        </div>
      )}

      <a
        href={rec.affiliateUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="mt-5 flex w-full items-center justify-center rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Shop {rec.board.name}
      </a>
    </div>
  );
}

export default async function GearResultsPage({ params }: Props) {
  const { slug } = await params;
  const data = await getRecommendation(slug);

  if (!data) notFound();

  const { inputs, recommendations } = data;

  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Your Board Recommendations
          </h1>
          <p className="mt-2 text-muted-foreground">
            Top picks for a{" "}
            <span className="font-medium text-foreground">{inputs.skill} rider</span> with a{" "}
            <span className="font-medium text-foreground">
              {BUDGET_LABELS[inputs.budget]}
            </span>{" "}
            budget.
          </p>
        </div>

        <div className="mb-8 rounded-lg border bg-muted/40 px-5 py-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Rider Profile
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
            <div>
              <span className="text-muted-foreground">Height</span>
              <p className="font-medium">{inputs.heightCm} cm</p>
            </div>
            <div>
              <span className="text-muted-foreground">Weight</span>
              <p className="font-medium">{inputs.weightKg} kg</p>
            </div>
            <div>
              <span className="text-muted-foreground">Boot Size</span>
              <p className="font-medium">US {inputs.bootSize}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Terrain</span>
              <p className="font-medium capitalize">{inputs.terrain.replace("-", " ")}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Budget</span>
              <p className="font-medium">{BUDGET_LABELS[inputs.budget]}</p>
            </div>
            {inputs.currentGear && (
              <div>
                <span className="text-muted-foreground">Current Board</span>
                <p className="font-medium">{inputs.currentGear}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec, i) => (
            <BoardCard key={rec.board.id} rec={rec} rank={i + 1} />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <ShareButton slug={slug} />
          <a
            href="/gear"
            className="w-full rounded-lg border border-border px-5 py-2.5 text-center text-sm font-medium transition-colors hover:bg-muted sm:w-auto"
          >
            Start Over
          </a>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Some links may be affiliate links. We may earn a small commission at no extra cost to you.
        </p>
      </div>
    </div>
  );
}
