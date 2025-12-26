import React, { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import vegetationTypes from "../mocks/vegetation-types.json";
import adminAreasRaw from "../mocks/admin-areas.geojson?raw";

const ExplorePage: React.FC = () => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: "全部",
    ndvi: 0.2,
    time: "2024-06"
  });

  useEffect(() => {
    const mapInstance = L.map("leaflet-map").setView([39.92, 116.38], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(mapInstance);

    const adminAreas = JSON.parse(adminAreasRaw) as any;
    const areasLayer = L.geoJSON(adminAreas as any, {
      style: { color: "#1d9b7f", weight: 2, fillOpacity: 0.1 },
      onEachFeature: (feature, layer) => {
        layer.on("click", () => {
          setSelectedArea((feature.properties as any)?.name ?? "未知区域");
        });
      }
    }).addTo(mapInstance);

    const points = Array.from({ length: 8 }).map(() => [
      39.88 + Math.random() * 0.08,
      116.30 + Math.random() * 0.12
    ]);
    points.forEach((point) => {
      const marker = L.circleMarker(point as [number, number], {
        radius: 6,
        color: "#4f8ef7",
        fillOpacity: 0.7
      });
      marker.bindPopup(
        `<div>植被类型：${vegetationTypes[Math.floor(Math.random() * vegetationTypes.length)]}<br/>盖度：${(
          Math.random() * 100
        ).toFixed(1)}%<br/>时间：2024-06</div>`
      );
      marker.addTo(mapInstance);
    });

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
      areasLayer.remove();
    };
  }, []);

  const stats = useMemo(
    () => ({
      coverage: (Math.random() * 40 + 40).toFixed(1),
      area: (Math.random() * 20 + 10).toFixed(2),
      topType: vegetationTypes[Math.floor(Math.random() * vegetationTypes.length)]
    }),
    [selectedArea, filters]
  );

  return (
    <div className="space-y-4">
      <div className="rounded bg-white p-4 shadow">
        <h2 className="text-lg font-semibold">地图探索</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <select
            value={filters.type}
            onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))}
            className="rounded border px-3 py-2"
          >
            <option value="全部">全部植被类型</option>
            {vegetationTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            type="month"
            value={filters.time}
            onChange={(event) => setFilters((prev) => ({ ...prev, time: event.target.value }))}
            className="rounded border px-3 py-2"
          />
          <label className="text-sm text-slate-500">
            NDVI 阈值 {filters.ndvi}
            <input
              type="range"
              min={0}
              max={0.8}
              step={0.1}
              value={filters.ndvi}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, ndvi: Number(event.target.value) }))
              }
              className="ml-2 align-middle"
            />
          </label>
          <div className="text-xs text-slate-400">
            当前地图：{selectedArea ?? "点击区域查看"}
          </div>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[3fr_1fr]">
        <div id="leaflet-map" className="h-[480px] rounded bg-white shadow" />
        <div className="rounded bg-white p-4 shadow">
          <h3 className="text-md font-semibold">统计面板</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div>覆盖率：{stats.coverage}%</div>
            <div>估算面积：{stats.area} km²</div>
            <div>Top 植被类型：{stats.topType}</div>
            <div>筛选时间：{filters.time}</div>
          </div>
        </div>
      </div>
      {map && null}
    </div>
  );
};

export default ExplorePage;
