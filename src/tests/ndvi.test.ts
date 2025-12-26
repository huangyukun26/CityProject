import { computeNDVIFromCSV } from "../utils/ndvi";

it("computes NDVI from csv rows", () => {
  const result = computeNDVIFromCSV([
    { NIR: 0.6, Red: 0.2 },
    { NIR: 0.3, Red: 0.1 }
  ]);
  expect(result.grid[0].length).toBe(2);
  expect(result.average).toBeGreaterThan(0);
  expect(result.vegetationRatio).toBeGreaterThan(0);
});
