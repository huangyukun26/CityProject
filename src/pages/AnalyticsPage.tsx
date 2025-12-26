import React, { useMemo } from "react";
import Chart from "../components/Chart";
import { useAnalyticsStore } from "../store/analyticsStore";

const AnalyticsPage: React.FC = () => {
  const events = useAnalyticsStore((state) => state.events);

  const visits = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return date.toLocaleDateString();
    });
    const counts = days.map((day) =>
      events.filter((event) => new Date(event.time).toLocaleDateString() === day).length
    );
    return { days, counts };
  }, [events]);

  const roleDistribution = [
    { name: "Admin", value: 4 },
    { name: "Reviewer", value: 6 },
    { name: "User", value: 12 }
  ];

  const regionDistribution = [
    { name: "华北", value: 30 },
    { name: "华东", value: 25 },
    { name: "华南", value: 18 },
    { name: "西南", value: 10 }
  ];

  return (
    <div className="space-y-6">
      <div className="rounded bg-white p-4 shadow">
        <h2 className="text-lg font-semibold">系统使用情况统计</h2>
        <p className="text-sm text-slate-500">数据来自前端埋点与 Mock 统计。</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded bg-white p-4 shadow">
          <h3 className="text-md font-semibold">访问量（按天）</h3>
          <Chart
            option={{
              xAxis: { type: "category", data: visits.days },
              yAxis: { type: "value" },
              series: [
                {
                  data: visits.counts,
                  type: "line",
                  smooth: true,
                  itemStyle: { color: "#1d9b7f" }
                }
              ]
            }}
            className="mt-4 h-64"
          />
        </div>
        <div className="rounded bg-white p-4 shadow">
          <h3 className="text-md font-semibold">访问地区</h3>
          <Chart
            option={{
              tooltip: { trigger: "item" },
              series: [
                {
                  type: "pie",
                  radius: "70%",
                  data: regionDistribution
                }
              ]
            }}
            className="mt-4 h-64"
          />
        </div>
      </div>
      <div className="rounded bg-white p-4 shadow">
        <h3 className="text-md font-semibold">用户角色占比</h3>
        <Chart
          option={{
            xAxis: { type: "category", data: roleDistribution.map((item) => item.name) },
            yAxis: { type: "value" },
            series: [
              {
                type: "bar",
                data: roleDistribution.map((item) => item.value),
                itemStyle: { color: "#4f8ef7" }
              }
            ]
          }}
          className="mt-4 h-64"
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;
