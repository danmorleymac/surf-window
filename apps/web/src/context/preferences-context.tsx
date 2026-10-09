import { createContext } from "react";

import type { HeightUnit, WindSpeedUnit } from "../types/units";

type PreferencesContextValue = {
  heightUnit: HeightUnit;
  setHeightUnit: (unit: HeightUnit) => void;
  windSpeedUnit: WindSpeedUnit;
  setWindSpeedUnit: (unit: WindSpeedUnit) => void;
};

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);
