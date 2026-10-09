import type { HeightUnit, WindSpeedUnit } from "../types/units";

export function formatHeight(value: number | null, unit: HeightUnit) {
  if (value === null) return "—";

  if (unit === "ft") {
    return `${(value * 3.28084).toFixed(1)} ft`;
  }

  return `${value.toFixed(1)} m`;
}

export function formatWindSpeed(value: number | null, unit: WindSpeedUnit) {
  if (value === null) return "—";

  if (unit === "mph") {
    return `${Math.round(value * 0.621371)} mph`;
  }

  return `${Math.round(value)} km/h`;
}
