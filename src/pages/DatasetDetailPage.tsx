import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { nanoid } from "nanoid";
import JSZip from "jszip";
import { useDatasetStore } from "../store/datasetStore";
import { useApprovalStore } from "../store/approvalStore";
import { useAuthStore } from "../store/authStore";
import { UploadFile } from "../types";
import { useToast } from "../components/Toast";

const DatasetDetailPage: React.FC = () => {
  const { id } = useParams();
  const datasets = useDatasetStore((state) => state.datasets);
  const addFile = useDatasetStore((state) => state.addFile);
  const updateFileProgress = useDatasetStore((state) => state.updateFileProgress);
  const updateStatus = useDatasetStore((state) => state.updateStatus);
  const addEntry = useApprovalStore((state) => state.addEntry);
  const user = useAuthStore((state) => state.user);
  const { notify } = useToast();
  const [uploading, setUploading] = useState(false);

  const dataset = useMemo(
    () => datasets.find((item) => item.id === id),
    [datasets, id]
  );

  if (!dataset) {
    return <div className="text-sm text-slate-500">未找到数据集</div>;
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files || uploading) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const content = await file.text().catch(() => "");
      const newFile: UploadFile = {
        id: nanoid(),
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        progress: 0,
        content
      };
      await addFile(dataset.id, newFile);
      let progress = 0;
      const timer = window.setInterval(() => {
        progress += Math.random() * 20;
        updateFileProgress(dataset.id, newFile.id, Math.min(100, progress));
        if (progress >= 100) {
          window.clearInterval(timer);
        }
      }, 300);
    }
    setTimeout(() => setUploading(false), 1200);
  };

  const exportDataset = async () => {
    const zip = new JSZip();
    zip.file("dataset.json", JSON.stringify(dataset, null, 2));
    zip.file(
      "files.csv",
      dataset.files.map((file) => `${file.name},${file.size},${file.type}`).join("\n")
    );
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${dataset.name}.zip`;
    link.click();
    URL.revokeObjectURL(url);
    notify("已导出数据集", "success");
  };

  const submitForReview = async () => {
    if (!user) return;
    await updateStatus(dataset.id, "Submitted");
    await addEntry(dataset.id, "Submitted", user.username, user.role, "提交审核");
    notify("已提交审核", "success");
  };

  return (
    <div className="space-y-6">
      <div className="rounded bg-white p-4 shadow">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-slate-500">{dataset.description}</div>
            <div className="text-xl font-semibold">{dataset.name}</div>
          </div>
          <div className="space-x-2">
            <span className="rounded bg-slate-100 px-2 py-1 text-xs">{dataset.status}</span>
            <button className="rounded border px-3 py-1 text-xs" onClick={exportDataset}>
              导出 ZIP
            </button>
            {dataset.status === "Draft" && (
              <button
                className="rounded bg-primary-500 px-3 py-1 text-xs text-white"
                onClick={submitForReview}
              >
                提交审核
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rounded bg-white p-4 shadow">
        <h2 className="text-lg font-semibold">导入文件</h2>
        <p className="text-sm text-slate-500">
          支持 tiff/png/jpg/csv/geojson，上传后模拟写入 HDFS。
        </p>
        <div className="mt-4 border-2 border-dashed border-slate-200 p-6 text-center">
          <input
            type="file"
            multiple
            className="w-full"
            onChange={(event) => handleFiles(event.target.files)}
          />
        </div>
        <div className="mt-4 space-y-2">
          {dataset.files.map((file) => (
            <div key={file.id} className="rounded border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="text-xs text-slate-500">
                    {Math.round(file.size / 1024)} KB · {file.type}
                  </div>
                </div>
                <span className="text-xs text-slate-400">目标路径：/hdfs/mock/{dataset.id}</span>
              </div>
              <div className="mt-2 h-2 rounded bg-slate-100">
                <div
                  className="h-2 rounded bg-primary-500"
                  style={{ width: `${file.progress}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-slate-400">
                块大小：128MB · 副本数：3 · 进度：{Math.round(file.progress)}%
              </div>
            </div>
          ))}
          {dataset.files.length === 0 && (
            <div className="text-sm text-slate-500">暂无上传文件</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatasetDetailPage;
