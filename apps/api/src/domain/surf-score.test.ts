import { describe, expect, it } from "vitest";

import { getSurfScore } from "./surf-score.js";

describe("getSurfScore", () => {
  it("rates ideal-sized surf with a good period and offshore wind highly", () => {
    const result = getSurfScore({
      spotId: "croyde",
      waveHeight: 1.5,
      swellPeriod: 10,
      windCondition: "offshore",
    });

    expect(result).toEqual({
      score: 100,
      rating: "excellent",
    });
  });

  it("penalises small surf and onshore wind", () => {
    const result = getSurfScore({
      spotId: "croyde",
      waveHeight: 0.3,
      swellPeriod: 5,
      windCondition: "onshore",
    });

    expect(result).toEqual({
      score: 10,
      rating: "poor",
    });
  });

  it("does not automatically reward very large surf", () => {
    const result = getSurfScore({
      spotId: "croyde",
      waveHeight: 3,
      swellPeriod: 10,
      windCondition: "offshore",
    });

    expect(result.score).toBe(75);
    expect(result.rating).toBe("good");
  });

  it("handles missing forecast data", () => {
    const result = getSurfScore({
      spotId: "joss-bay",
      waveHeight: null,
      swellPeriod: null,
      windCondition: null,
    });

    expect(result).toEqual({
      score: 0,
      rating: "poor",
    });
  });

  it("gives Joss Bay a bonus for onshore wind around a 7s period", () => {
    const result = getSurfScore({
      spotId: "joss-bay",
      waveHeight: 1,
      swellPeriod: 7,
      windCondition: "onshore",
    });

    expect(result.score).toBe(65);
    expect(result.rating).toBe("good");
  });

  it("gives Cromer a bonus for a 7–8s swell period", () => {
    const result = getSurfScore({
      spotId: "cromer",
      waveHeight: 1,
      swellPeriod: 7.5,
      windCondition: "cross-shore",
    });

    expect(result.score).toBe(80);
    expect(result.rating).toBe("excellent");
  });
});
