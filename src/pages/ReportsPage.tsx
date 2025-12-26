import React, { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { buildReportSections } from "../utils/report";

const templateOptions = [
  { id: "weekly", label: "周报" },
  { id: "monthly", label: "月报" },
  { id: "special", label: "专题分析" }
];

const chartOptions = [
  { id: "ndvi", label: "NDVI 直方图" },
  { id: "ranking", label: "区级排行" },
  { id: "timeline", label: "时间序列" }
];

const ReportsPage: React.FC = () => {
  const [template, setTemplate] = useState("weekly");
  const [selected, setSelected] = useState<string[]>(["ndvi"]);
  const sections = useMemo(
    () => buildReportSections(templateOptions.find((t) => t.id === template)?.label ?? "周报", selected),
    [template, selected]
  );

  const toggleOption = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("城市植被覆盖率报告", 10, 16);
    doc.setFontSize(12);
    sections.forEach((section, index) => {
      const y = 30 + index * 20;
      doc.text(`${section.title}: ${section.content}`, 10, y);
    });
    doc.save(`report-${template}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded bg-white p-4 shadow">
        <h2 className="text-lg font-semibold">报告生成</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <select
            value={template}
            onChange={(event) => setTemplate(event.target.value)}
            className="rounded border px-3 py-2"
          >
            {templateOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <div className="col-span-2 flex flex-wrap gap-3">
            {chartOptions.map((item) => (
              <label key={item.id} className="text-sm">
                <input
                  type="checkbox"
                  checked={selected.includes(item.id)}
                  onChange={() => toggleOption(item.id)}
                  className="mr-1"
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>
        <button className="mt-4 rounded bg-primary-500 px-4 py-2 text-white" onClick={exportPdf}>
          导出 PDF
        </button>
      </div>
      <div className="rounded bg-white p-6 shadow">
        <h3 className="text-md font-semibold">报告预览</h3>
        <div className="mt-4 space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="rounded border p-4">
              <div className="text-sm font-semibold">{section.title}</div>
              <p className="mt-2 text-sm text-slate-600">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
