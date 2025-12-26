import { NDVIResult } from "../types";

export const computeNDVIFromCSV = (
  rows: Array<{ NIR: number; Red: number }>
): NDVIResult => {
  const values = rows.map((row) => {
    const ndvi = (row.NIR - row.Red) / (row.NIR + row.Red + 1e-6);
    return Number(ndvi.toFixed(4));
  });
  const grid = [values];
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  const vegetationRatio = values.filter((val) => val > 0.2).length / values.length;
  const histogram = buildHistogram(values);
  return {
    grid,
    average,
    vegetationRatio,
    histogram
  };
};

export const computeNDVIForImage = (width: number, height: number): NDVIResult => {
  const grid: number[][] = [];
  const values: number[] = [];
  for (let y = 0; y < height; y += 1) {
    const row: number[] = [];
    for (let x = 0; x < width; x += 1) {
      const base = Math.sin(x / 8) * Math.cos(y / 6);
      const random = (Math.random() - 0.5) * 0.2;
      const ndvi = Math.max(-1, Math.min(1, base + random));
      row.push(Number(ndvi.toFixed(4)));
      values.push(ndvi);
    }
    grid.push(row);
  }
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  const vegetationRatio = values.filter((val) => val > 0.2).length / values.length;
  const histogram = buildHistogram(values);
  return {
    grid,
    average,
    vegetationRatio,
    histogram
  };
};

const buildHistogram = (values: number[]) => {
  const buckets = [-1, -0.5, 0, 0.2, 0.4, 0.6, 0.8, 1];
  return buckets.slice(0, -1).map((start, index) => {
    const end = buckets[index + 1];
    const count = values.filter((val) => val >= start && val < end).length;
    return { bucket: `${start.toFixed(1)}~${end.toFixed(1)}`, value: count };
  });
};
