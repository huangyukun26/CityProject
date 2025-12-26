import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDatasetStore } from "../store/datasetStore";
import { useToast } from "../components/Toast";
import { useAnalyticsStore } from "../store/analyticsStore";

const DatasetsPage: React.FC = () => {
  const datasets = useDatasetStore((state) => state.datasets);
  const create = useDatasetStore((state) => state.create);
  const softDelete = useDatasetStore((state) => state.softDelete);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { notify } = useToast();
  const track = useAnalyticsStore((state) => state.track);

  const active = datasets.filter((item) => !item.deleted);

  const handleCreate = async () => {
    if (!name) return;
    await create(name, description || "默认描述");
    setName("");
    setDescription("");
    notify("数据集已创建", "success");
    void track("click", "dataset-create");
  };

  return (
    <div className="space-y-6">
      <div className="rounded bg-white p-4 shadow">
        <h2 className="text-lg font-semibold">新建数据集</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded border px-3 py-2"
            placeholder="数据集名称"
          />
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="rounded border px-3 py-2"
            placeholder="描述"
          />
          <button className="rounded bg-primary-500 text-white" onClick={handleCreate}>
            创建
          </button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {active.map((dataset) => (
          <div key={dataset.id} className="rounded bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">{dataset.description}</div>
                <div className="text-lg font-semibold">{dataset.name}</div>
              </div>
              <span className="rounded bg-slate-100 px-2 py-1 text-xs">
                {dataset.status}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>文件数量：{dataset.files.length}</span>
              <span>{new Date(dataset.createdAt).toLocaleString()}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                to={`/app/datasets/${dataset.id}`}
                className="rounded border px-3 py-1 text-sm"
              >
                查看详情
              </Link>
              <button
                className="rounded border px-3 py-1 text-sm text-rose-500"
                onClick={() => softDelete(dataset.id)}
              >
                软删除
              </button>
            </div>
          </div>
        ))}
        {active.length === 0 && (
          <div className="rounded bg-white p-6 text-center text-sm text-slate-500 shadow">
            暂无数据集，请先创建。
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetsPage;
