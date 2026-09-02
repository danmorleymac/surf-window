export type WindCondition =
  | "offshore"
  | "cross-offshore"
  | "cross-shore"
  | "cross-onshore"
  | "onshore";

function angleDifference(a: number, b: number): number {
  const difference = Math.abs(a - b) % 360;

  return Math.min(difference, 360 - difference);
}

export function getWindCondition(windDirection: number, shoreBearing: number): WindCondition {
  const difference = angleDifference(windDirection, shoreBearing);

  if (difference < 30) {
    return "onshore";
  }

  if (difference < 75) {
    return "cross-onshore";
  }

  if (difference < 105) {
    return "cross-shore";
  }

  if (difference < 150) {
    return "cross-offshore";
  }

  return "offshore";
}
