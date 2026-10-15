export type SpotScoreConditions = {
  swellPeriod: number | null;
  windCondition: "onshore" | "cross-onshore" | "cross-shore" | "cross-offshore" | "offshore" | null;
};

export type ScoreAdjustment = {
  points: number;
  reason: string;
};

export function getSpotScoreAdjustments(
  spotId: string,
  conditions: SpotScoreConditions
): ScoreAdjustment[] {
  const adjustments: ScoreAdjustment[] = [];

  switch (spotId) {
    case "joss-bay":
      if (
        conditions.windCondition === "onshore" &&
        conditions.swellPeriod !== null &&
        conditions.swellPeriod >= 6.5 &&
        conditions.swellPeriod <= 7.5
      ) {
        adjustments.push({
          points: 15,
          reason: "Joss Bay can work with onshore wind around a 7s swell period",
        });
      }

      break;

    case "cromer":
      if (
        conditions.swellPeriod !== null &&
        conditions.swellPeriod >= 7 &&
        conditions.swellPeriod <= 8
      ) {
        adjustments.push({
          points: 10,
          reason: "Cromer can work on shorter 7–8s swell periods",
        });
      }

      break;
  }

  return adjustments;
}
