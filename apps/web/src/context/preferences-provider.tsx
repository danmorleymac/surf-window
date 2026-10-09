import { useState, type ReactNode } from "react";

import type { HeightUnit, WindSpeedUnit } from "../types/units";
import { PreferencesContext } from "./preferences-context";

const HEIGHT_UNIT_STORAGE_KEY = "surf-window-height-unit";
const WIND_SPEED_UNIT_STORAGE_KEY = "surf-window-wind-speed-unit";

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [heightUnit, setHeightUnitState] = useState<HeightUnit>(() => {
    const savedUnit = localStorage.getItem(HEIGHT_UNIT_STORAGE_KEY);

    return savedUnit === "ft" ? "ft" : "m";
  });

  const [windSpeedUnit, setWindSpeedUnitState] = useState<WindSpeedUnit>(() => {
    const savedUnit = localStorage.getItem(WIND_SPEED_UNIT_STORAGE_KEY);

    return savedUnit === "mph" ? "mph" : "km/h";
  });

  function setHeightUnit(unit: HeightUnit) {
    setHeightUnitState(unit);
    localStorage.setItem(HEIGHT_UNIT_STORAGE_KEY, unit);
  }

  function setWindSpeedUnit(unit: WindSpeedUnit) {
    setWindSpeedUnitState(unit);
    localStorage.setItem(WIND_SPEED_UNIT_STORAGE_KEY, unit);
  }

  return (
    <PreferencesContext.Provider
      value={{
        heightUnit,
        setHeightUnit,
        windSpeedUnit,
        setWindSpeedUnit,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}
