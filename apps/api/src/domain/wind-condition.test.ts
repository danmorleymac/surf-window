import { describe, expect, it } from "vitest";

import { getWindCondition } from "./wind-condition.js";

describe("getWindCondition", () => {
  const westFacingShore = 270;

  it("classifies onshore wind", () => {
    expect(getWindCondition(270, westFacingShore)).toBe("onshore");
  });

  it("classifies cross-onshore wind", () => {
    expect(getWindCondition(225, westFacingShore)).toBe("cross-onshore");
  });

  it("classifies cross-shore wind", () => {
    expect(getWindCondition(180, westFacingShore)).toBe("cross-shore");
  });

  it("classifies cross-offshore wind", () => {
    expect(getWindCondition(135, westFacingShore)).toBe("cross-offshore");
  });

  it("classifies offshore wind", () => {
    expect(getWindCondition(90, westFacingShore)).toBe("offshore");
  });

  it("handles directions across the 0/360 degree boundary", () => {
    expect(getWindCondition(350, 10)).toBe("onshore");
  });

  it("classifies the opposite direction as offshore", () => {
    expect(getWindCondition(10, 190)).toBe("offshore");
  });
});
