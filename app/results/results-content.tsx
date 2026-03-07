'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Snowboard } from '@/lib/snowboards';
import { Share2, ArrowLeft, ExternalLink } from 'lucide-react';

interface Recommendation {
  board: Snowboard;
  score: number;
  matchReasons: string[];
  aiRationale: string;
}

interface RecommendationResponse {
  recommendations: Recommendation[];
  profile: any;
}

export default function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const profile = {
          height: Number(searchParams.get('height')),
          weight: Number(searchParams.get('weight')),
          bootSize: Number(searchParams.get('bootSize')),
          skillLevel: searchParams.get('skillLevel'),
          terrainPreference: searchParams.get('terrainPreference'),
          budgetMin: Number(searchParams.get('budgetMin')),
          budgetMax: Number(searchParams.get('budgetMax')),
        };

        const response = await fetch('/api/recommend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profile),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get recommendations');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [searchParams]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-lg text-slate-600">Finding your perfect snowboards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">{error}</p>
            <Button onClick={() => router.push('/')} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Form
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data || data.recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Recommendations Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">
              We couldn't find any boards matching your criteria. Try adjusting your preferences.
            </p>
            <Button onClick={() => router.push('/')} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="mountains" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <path d="M0 150 L50 100 L100 150 L150 80 L200 150 Z" fill="currentColor" className="text-slate-900"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#mountains)" />
        </svg>
      </div>

      <main className="relative max-w-6xl mx-auto px-4 py-12">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
              Your Perfect Boards
            </h1>
            <p className="text-slate-600 mt-2">
              Based on your profile: {data.profile.skillLevel} • {data.profile.terrainPreference}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              {copied ? 'Copied!' : 'Share'}
            </Button>
            <Button variant="outline" onClick={() => router.push('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              New Search
            </Button>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-6">
          {data.recommendations.map((rec, index) => (
            <Card key={rec.board.id} className="shadow-lg border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2"></div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-blue-600">#{index + 1}</span>
                      <div>
                        <CardTitle className="text-2xl">{rec.board.name}</CardTitle>
                        <CardDescription className="text-base mt-1">
                          by {rec.board.brand}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">
                      ${rec.board.priceRange.min} - ${rec.board.priceRange.max}
                    </div>
                    <div className="text-sm text-slate-500">USD</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* AI Rationale */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-slate-700 leading-relaxed">{rec.aiRationale}</p>
                </div>

                {/* Board Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <div className="text-sm text-slate-500">Shape</div>
                    <div className="font-semibold text-slate-900">{rec.board.specs.shape}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Flex</div>
                    <div className="font-semibold text-slate-900">{rec.board.specs.flex}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Camber</div>
                    <div className="font-semibold text-slate-900">{rec.board.specs.camberProfile}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Lengths</div>
                    <div className="font-semibold text-slate-900">
                      {rec.board.specs.length[0]}-{rec.board.specs.length[rec.board.specs.length.length - 1]}cm
                    </div>
                  </div>
                </div>

                {/* Match Reasons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {rec.matchReasons.map((reason, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm border border-slate-200"
                    >
                      {reason}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-slate-600 italic pt-2">{rec.board.description}</p>

                {/* CTA */}
                <div className="pt-4">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(rec.board.brand + ' ' + rec.board.name + ' snowboard buy')}`, '_blank')}
                  >
                    Find {rec.board.name} Online
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-sm text-slate-500 space-y-2">
          <p>Recommendations are based on your profile and expert snowboard knowledge.</p>
          <p>Always demo boards when possible and consult with local shop experts.</p>
        </div>
      </main>
    </div>
  );
}
