import React, { useEffect, useRef, useState } from "react";
import models from "../mocks/models.json";
import { useDatasetStore } from "../store/datasetStore";
import { ModelVersion } from "../types";
import { useToast } from "../components/Toast";

const mockLogs = [
  "加载权重...",
  "初始化推理引擎...",
  "切分影像 tiles...",
  "执行 MAE 推理...",
  "融合结果...",
  "生成重建影像...",
  "推理完成"
];

const InferencePage: React.FC = () => {
  const datasets = useDatasetStore((state) => state.datasets);
  const [model, setModel] = useState<ModelVersion>(models[0] as ModelVersion);
  const [datasetId, setDatasetId] = useState("");
  const [fileId, setFileId] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { notify } = useToast();

  const dataset = datasets.find((item) => item.id === datasetId);
  const file = dataset?.files.find((item) => item.id === fileId);

  useEffect(() => {
    if (file?.content && file.name.match(/\.(png|jpg|jpeg)$/i)) {
      const blob = new Blob([file.content], { type: "image/png" });
      setOriginalUrl(URL.createObjectURL(blob));
    } else {
      setOriginalUrl(null);
    }
  }, [file]);

  const runInference = () => {
    if (!file) return;
    setLogs([]);
    setProcessing(true);
    let index = 0;
    const interval = window.setInterval(() => {
      setLogs((prev) => [...prev, mockLogs[index]]);
      index += 1;
      if (index === mockLogs.length) {
        window.clearInterval(interval);
        setProcessing(false);
        createResult();
        notify("推理完成", "success");
      }
    }, 500);
  };

  const createResult = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = 400;
    const height = 260;
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = "#d1f5e0";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#1d9b7f";
    ctx.font = "20px sans-serif";
    ctx.fillText("重建结果 (Mock)", 20, 40);
    for (let i = 0; i < 1200; i += 1) {
      ctx.fillStyle = `rgba(29, 155, 127, ${Math.random() * 0.3})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 4, 4);
    }
    setResultUrl(canvas.toDataURL("image/png"));
  };

  return (
    <div className="space-y-6">
      <div className="rounded bg-white p-4 shadow">
        <h2 className="text-lg font-semibold">模型推理</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <select
            value={model.id}
            onChange={(event) => {
              const selected = (models as ModelVersion[]).find(
                (item) => item.id === event.target.value
              );
              if (selected) setModel(selected);
            }}
            className="rounded border px-3 py-2"
          >
            {(models as ModelVersion[]).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} {item.version}
              </option>
            ))}
          </select>
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
            <option value="">选择影像</option>
            {dataset?.files.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <button
          className="mt-4 rounded bg-primary-500 px-4 py-2 text-white"
          onClick={runInference}
          disabled={processing || !file}
        >
          {processing ? "推理中..." : "开始推理"}
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded bg-white p-4 shadow">
          <h3 className="text-md font-semibold">日志流</h3>
          <div className="mt-3 h-52 overflow-auto rounded bg-slate-900 p-3 text-xs text-emerald-200">
            {logs.map((log, index) => (
              <div key={`${log}-${index}`}>{log}</div>
            ))}
          </div>
        </div>
        <div className="rounded bg-white p-4 shadow">
          <h3 className="text-md font-semibold">结果对比</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded border p-2 text-center text-xs">
              <div className="mb-2 text-slate-500">原始影像</div>
              <div className="h-40 rounded bg-slate-100">
                {originalUrl ? (
                  <img src={originalUrl} alt="original" className="h-40 w-full object-cover" />
                ) : (
                  <div className="flex h-40 items-center justify-center text-slate-400">
                    无影像
                  </div>
                )}
              </div>
            </div>
            <div className="rounded border p-2 text-center text-xs">
              <div className="mb-2 text-slate-500">重建影像</div>
              <div className="h-40 rounded bg-slate-100">
                {resultUrl ? (
                  <img src={resultUrl} alt="result" className="h-40 w-full object-cover" />
                ) : (
                  <div className="flex h-40 items-center justify-center text-slate-400">
                    等待推理
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default InferencePage;
