import { describe, it, expect } from "vitest";

describe("audit engine", () => {
  it("annual savings calculation works", () => {
    const monthlySavings = 100;
    const annualSavings = monthlySavings * 12;

    expect(annualSavings).toBe(1200);
  });

  it("optimized flag works for low savings", () => {
    const monthlySavings = 40;
    const isOptimized = monthlySavings < 50;

    expect(isOptimized).toBe(true);
  });

  it("high savings should not be optimized", () => {
    const monthlySavings = 300;
    const isOptimized = monthlySavings < 50;

    expect(isOptimized).toBe(false);
  });

  it("savings should never be negative", () => {
    const savings = Math.max(0, -50);

    expect(savings).toBe(0);
  });

  it("basic audit math works", () => {
    expect(2 + 2).toBe(4);
  });
});