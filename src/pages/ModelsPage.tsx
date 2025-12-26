import React, { useState } from "react";
import models from "../mocks/models.json";
import { ModelVersion } from "../types";

const ModelsPage: React.FC = () => {
  const [current, setCurrent] = useState<ModelVersion>(models[0] as ModelVersion);

  return (
    <div className="space-y-6">
      <div className="rounded bg-white p-4 shadow">
        <h2 className="text-lg font-semibold">模型管理</h2>
        <p className="text-sm text-slate-500">切换模型版本并查看差异。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {(models as ModelVersion[]).map((model) => (
          <div key={model.id} className="rounded bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">{model.name}</div>
                <div className="text-lg font-semibold">{model.version}</div>
              </div>
              <button
                className="rounded border px-3 py-1 text-xs"
                onClick={() => setCurrent(model)}
              >
                设为当前
              </button>
            </div>
            <div className="mt-2 text-xs text-slate-500">发布时间：{model.releasedAt}</div>
            <div className="mt-3 text-sm">MAE: {model.metrics.mae} · PSNR: {model.metrics.psnr}</div>
            <p className="mt-2 text-xs text-slate-500">{model.description}</p>
          </div>
        ))}
      </div>
      <div className="rounded bg-white p-4 shadow">
        <h3 className="text-md font-semibold">当前版本差异</h3>
        <div className="mt-3 text-sm">{current.version}</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          {current.diff.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ModelsPage;
