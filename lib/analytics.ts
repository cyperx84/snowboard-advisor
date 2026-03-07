import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { UserProfile } from './recommendation-engine';

interface AnalyticsEvent {
  profile: UserProfile;
  timestamp: string;
  recommendationCount: number;
}

const ANALYTICS_DIR = path.join(process.cwd(), 'data');
const ANALYTICS_FILE = path.join(ANALYTICS_DIR, 'analytics.json');

export async function trackRecommendation(event: AnalyticsEvent): Promise<void> {
  try {
    // Ensure data directory exists
    if (!existsSync(ANALYTICS_DIR)) {
      await mkdir(ANALYTICS_DIR, { recursive: true });
    }

    // Read existing data
    let events: AnalyticsEvent[] = [];
    if (existsSync(ANALYTICS_FILE)) {
      const data = await readFile(ANALYTICS_FILE, 'utf-8');
      events = JSON.parse(data);
    }

    // Add new event
    events.push(event);

    // Write back to file
    await writeFile(ANALYTICS_FILE, JSON.stringify(events, null, 2));
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Don't throw - analytics shouldn't break the app
  }
}

export async function getAnalytics() {
  try {
    if (!existsSync(ANALYTICS_FILE)) {
      return {
        totalRequests: 0,
        bySkillLevel: {},
        byTerrain: {},
        averageBudget: 0,
      };
    }

    const data = await readFile(ANALYTICS_FILE, 'utf-8');
    const events: AnalyticsEvent[] = JSON.parse(data);

    const analytics = {
      totalRequests: events.length,
      bySkillLevel: events.reduce((acc, event) => {
        acc[event.profile.skillLevel] = (acc[event.profile.skillLevel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byTerrain: events.reduce((acc, event) => {
        acc[event.profile.terrainPreference] = (acc[event.profile.terrainPreference] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averageBudget: events.reduce((sum, event) => sum + event.profile.budgetMax, 0) / events.length,
    };

    return analytics;
  } catch (error) {
    console.error('Analytics read error:', error);
    return {
      totalRequests: 0,
      bySkillLevel: {},
      byTerrain: {},
      averageBudget: 0,
    };
  }
}
