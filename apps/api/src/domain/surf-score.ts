import { getSpotScoreAdjustments } from "./spot-score-adjustments.js";

export type SurfRating = "poor" | "fair" | "good" | "excellent";

export type SurfScoreInput = {
  spotId: string;
  waveHeight: number | null;
  swellPeriod: number | null;
  windCondition: "onshore" | "cross-onshore" | "cross-shore" | "cross-offshore" | "offshore" | null;
};

export type SurfScore = {
  score: number;
  rating: SurfRating;
};

function scoreWaveHeight(waveHeight: number | null) {
  if (waveHeight === null) return 0;

  if (waveHeight < 0.5) return 5;
  if (waveHeight < 1) return 20;
  if (waveHeight <= 2) return 35;
  if (waveHeight <= 2.5) return 25;

  return 10;
}

function scoreSwellPeriod(swellPeriod: number | null) {
  if (swellPeriod === null) return 0;

  if (swellPeriod < 6) return 5;
  if (swellPeriod < 8) return 15;
  if (swellPeriod < 10) return 22;
  if (swellPeriod < 14) return 30;

  return 25;
}

function scoreWindCondition(windCondition: SurfScoreInput["windCondition"]) {
  switch (windCondition) {
    case "offshore":
      return 35;
    case "cross-offshore":
      return 30;
    case "cross-shore":
      return 20;
    case "cross-onshore":
      return 10;
    case "onshore":
      return 0;
    default:
      return 0;
  }
}

function getRating(score: number): SurfRating {
  if (score >= 80) return "excellent";
  if (score >= 65) return "good";
  if (score >= 50) return "fair";

  return "poor";
}

export function getSurfScore({
  spotId,
  waveHeight,
  swellPeriod,
  windCondition,
}: SurfScoreInput): SurfScore {
  const baseScore =
    scoreWaveHeight(waveHeight) + scoreSwellPeriod(swellPeriod) + scoreWindCondition(windCondition);

  const adjustments = getSpotScoreAdjustments(spotId, {
    swellPeriod,
    windCondition,
  });

  const adjustmentScore = adjustments.reduce((total, adjustment) => total + adjustment.points, 0);

  const score = Math.max(0, Math.min(100, baseScore + adjustmentScore));

  return {
    score,
    rating: getRating(score),
  };
}
