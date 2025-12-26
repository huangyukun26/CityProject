import { ReportSection } from "../types";

export const buildReportSections = (
  template: string,
  selected: string[]
): ReportSection[] => {
  const baseSections: ReportSection[] = [
    {
      id: "summary",
      title: `${template} 总览`,
      content: "本期报告基于模拟数据生成，用于演示流程。"
    }
  ];

  const map = new Map<string, ReportSection>([
    [
      "ndvi",
      {
        id: "ndvi",
        title: "NDVI 分布分析",
        content: "展示 NDVI 直方图、平均值与植被占比。"
      }
    ],
    [
      "ranking",
      {
        id: "ranking",
        title: "行政区覆盖率排行",
        content: "按行政区统计的植被覆盖率排名与变化趋势。"
      }
    ],
    [
      "timeline",
      {
        id: "timeline",
        title: "时间序列趋势",
        content: "模拟时间序列曲线展示植被覆盖率变化。"
      }
    ]
  ]);

  selected.forEach((item) => {
    const section = map.get(item);
    if (section) baseSections.push(section);
  });

  return baseSections;
};
