import React, { useMemo, useState } from "react";
import { useDatasetStore } from "../store/datasetStore";
import { computeNDVIForImage, computeNDVIFromCSV } from "../utils/ndvi";
import { parseCSV } from "../utils/csv";
import { NDVIResult } from "../types";
import Chart from "../components/Chart";
import adminAreas from "../mocks/admin-areas.geojson";

const renderNDVIToCanvas = (grid: number[][]) => {
  const canvas = document.createElement("canvas");
  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const imageData = ctx.createImageData(width, height);
  grid.forEach((row, y) => {
    row.forEach((value, x) => {
      const idx = (y * width + x) * 4;
      const color = valueToColor(value);
      imageData.data[idx] = color[0];
      imageData.data[idx + 1] = color[1];
      imageData.data[idx + 2] = color[2];
      imageData.data[idx + 3] = 255;
    });
  });
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
};

const valueToColor = (value: number) => {
  if (value < 0) return [120, 120, 120];
  if (value < 0.2) return [202, 224, 140];
  if (value < 0.4) return [120, 200, 80];
  if (value < 0.6) return [64, 160, 70];
  return [32, 120, 60];
};

const NDVIPage: React.FC = () => {
  const datasets = useDatasetStore((state) => state.datasets);
  const [datasetId, setDatasetId] = useState("");
  const [fileId, setFileId] = useState("");
  const [result, setResult] = useState<NDVIResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [ranking, setRanking] = useState<{ name: string; value: number }[]>([]);

  const dataset = datasets.find((item) => item.id === datasetId);
  const file = dataset?.files.find((item) => item.id === fileId);

  const handleCompute = () => {
    if (!dataset || !file) return;
    let output: NDVIResult;
    if (file.name.endsWith(".csv") && file.content) {
      const rows = parseCSV(file.content)
        .filter((row) => row.NIR && row.Red)
        .map((row) => ({ NIR: Number(row.NIR), Red: Number(row.Red) }))
        .filter((row) => !Number.isNaN(row.NIR) && !Number.isNaN(row.Red));
      output = computeNDVIFromCSV(rows.length ? rows : [{ NIR: 0.6, Red: 0.2 }]);
    } else {
      output = computeNDVIForImage(60, 40);
    }
    setResult(output);
    setImageUrl(renderNDVIToCanvas(output.grid));
    const adminRanking = (adminAreas as any).features.map((feature: any) => ({
      name: feature.properties.name,
      value: Number((Math.random() * 0.6 + 0.2).toFixed(2))
    }));
    setRanking(adminRanking);
  };

  const histogramOption = useMemo(
    () => ({
      xAxis: {
        type: "category",
        data: result?.histogram.map((item) => item.bucket) ?? []
      },
      yAxis: { type: "value" },
      series: [
        {
          data: result?.histogram.map((item) => item.value) ?? [],
          type: "bar",
          itemStyle: { color: "#1d9b7f" }
        }
      ]
    }),
    [result]
  );

  const rankingOption = useMemo(
    () => ({
      xAxis: { type: "value" },
      yAxis: {
        type: "category",
        data: ranking.map((item) => item.name)
      },
      series: [
        {
          type: "bar",
          data: ranking.map((item) => item.value),
          itemStyle: { color: "#4f8ef7" }
        }
      ]
    }),
    [ranking]
  );

  return (
    <div className="space-y-6">
      <div className="rounded bg-white p-4 shadow">
        <h2 className="text-lg font-semibold">NDVI 计算</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <select
            value={datasetId}
            onChange={(event) => {
              setDatasetId(event.target.value);
              setFileId("");
            }}
            className="rounded border px-3 py-2"
          >
            <option value="">选择数据集</option>
            {datasets.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            value={fileId}
            onChange={(event) => setFileId(event.target.value)}
            className="rounded border px-3 py-2"
          >
            <option value="">选择影像/CSV</option>
            {dataset?.files.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <button className="rounded bg-primary-500 text-white" onClick={handleCompute}>
            计算 NDVI
          </button>
        </div>
      </div>
      {result && (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <div className="rounded bg-white p-4 shadow">
              <h3 className="text-md font-semibold">NDVI 颜色图</h3>
              <img src={imageUrl} alt="ndvi" className="mt-4 w-full rounded" />
            </div>
            <div className="rounded bg-white p-4 shadow">
              <h3 className="text-md font-semibold">NDVI 分布直方图</h3>
              <Chart option={histogramOption} className="mt-4 h-64" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded bg-white p-4 shadow">
              <h3 className="text-md font-semibold">关键指标</h3>
              <div className="mt-4 space-y-2 text-sm">
                <div>平均 NDVI：{result.average.toFixed(3)}</div>
                <div>植被像素占比：{(result.vegetationRatio * 100).toFixed(1)}%</div>
                <div>阈值：NDVI &gt; 0.2</div>
              </div>
            </div>
            <div className="rounded bg-white p-4 shadow">
              <h3 className="text-md font-semibold">行政区覆盖率排行</h3>
              <Chart option={rankingOption} className="mt-4 h-64" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NDVIPage;
