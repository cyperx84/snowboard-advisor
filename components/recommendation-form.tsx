'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function RecommendationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    bootSize: '',
    skillLevel: '',
    terrainPreference: '',
    budgetMin: '',
    budgetMax: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const profile = {
        height: Number(formData.height),
        weight: Number(formData.weight),
        bootSize: Number(formData.bootSize),
        skillLevel: formData.skillLevel,
        terrainPreference: formData.terrainPreference,
        budgetMin: Number(formData.budgetMin),
        budgetMax: Number(formData.budgetMax),
      };

      // Navigate to results page with query params
      const params = new URLSearchParams({
        height: profile.height.toString(),
        weight: profile.weight.toString(),
        bootSize: profile.bootSize.toString(),
        skillLevel: profile.skillLevel,
        terrainPreference: profile.terrainPreference,
        budgetMin: profile.budgetMin.toString(),
        budgetMax: profile.budgetMax.toString(),
      });

      router.push(`/results?${params.toString()}`);
    } catch (err) {
      setError('Failed to process your request. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl border-slate-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Find Your Perfect Board
        </CardTitle>
        <CardDescription className="text-base">
          Tell us about yourself and we'll recommend the best snowboards for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="175"
                min="140"
                max="220"
                required
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                min="40"
                max="150"
                required
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>

            {/* Boot Size */}
            <div className="space-y-2">
              <Label htmlFor="bootSize">Boot Size (US)</Label>
              <Input
                id="bootSize"
                type="number"
                step="0.5"
                placeholder="10"
                min="5"
                max="15"
                required
                value={formData.bootSize}
                onChange={(e) => setFormData({ ...formData, bootSize: e.target.value })}
              />
            </div>

            {/* Skill Level */}
            <div className="space-y-2">
              <Label htmlFor="skillLevel">Skill Level</Label>
              <Select
                required
                value={formData.skillLevel}
                onValueChange={(value) => setFormData({ ...formData, skillLevel: value })}
              >
                <SelectTrigger id="skillLevel">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Terrain Preference */}
            <div className="space-y-2">
              <Label htmlFor="terrainPreference">Terrain Preference</Label>
              <Select
                required
                value={formData.terrainPreference}
                onValueChange={(value) => setFormData({ ...formData, terrainPreference: value })}
              >
                <SelectTrigger id="terrainPreference">
                  <SelectValue placeholder="Select terrain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-mountain">All-Mountain</SelectItem>
                  <SelectItem value="freestyle">Freestyle / Park</SelectItem>
                  <SelectItem value="powder">Powder</SelectItem>
                  <SelectItem value="carving">Carving</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Budget Range */}
          <div className="space-y-2">
            <Label>Budget Range (USD)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="number"
                  placeholder="Min: 300"
                  min="0"
                  step="50"
                  required
                  value={formData.budgetMin}
                  onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max: 800"
                  min="0"
                  step="50"
                  required
                  value={formData.budgetMax}
                  onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-6 text-lg"
            disabled={loading}
          >
            {loading ? 'Finding Your Perfect Board...' : 'Get Recommendations'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
