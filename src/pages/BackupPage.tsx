import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { BackupRecord } from "../types";
import { storage } from "../utils/storage";
import { useToast } from "../components/Toast";

const STORAGE_KEY = "backup-records";

const BackupPage: React.FC = () => {
  const [autoBackup, setAutoBackup] = useState(true);
  const [records, setRecords] = useState<BackupRecord[]>([]);
  const { notify } = useToast();

  useEffect(() => {
    storage.get<BackupRecord[]>(STORAGE_KEY, []).then((data) => setRecords(data ?? []));
  }, []);

  const saveRecords = async (items: BackupRecord[]) => {
    setRecords(items);
    await storage.set(STORAGE_KEY, items);
  };

  const handleBackup = async () => {
    const snapshot = {
      time: new Date().toISOString(),
      localStorage: { ...localStorage }
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    const newRecord: BackupRecord = {
      id: nanoid(),
      time: new Date().toLocaleString(),
      datasetCount: Number(localStorage.getItem("datasets") ? 2 : 0),
      size: `${Math.round(blob.size / 1024)} KB`,
      status: "Success"
    };
    await saveRecords([newRecord, ...records]);
    notify("已生成备份包", "success");
  };

  return (
    <div className="space-y-6">
      <div className="rounded bg-white p-4 shadow">
        <h2 className="text-lg font-semibold">备份机制</h2>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">自动备份</div>
            <div className="text-xs text-slate-500">每日 02:00 执行</div>
          </div>
          <button
            className={`rounded px-3 py-1 text-sm ${
              autoBackup ? "bg-primary-500 text-white" : "bg-slate-200"
            }`}
            onClick={() => setAutoBackup((prev) => !prev)}
          >
            {autoBackup ? "已开启" : "已关闭"}
          </button>
        </div>
        <button className="mt-4 rounded bg-emerald-500 px-4 py-2 text-white" onClick={handleBackup}>
          手动备份
        </button>
      </div>
      <div className="rounded bg-white p-4 shadow">
        <h3 className="text-md font-semibold">备份历史</h3>
        <div className="mt-4 space-y-2 text-sm">
          {records.map((record) => (
            <div key={record.id} className="rounded border p-3">
              <div className="flex items-center justify-between">
                <span>{record.time}</span>
                <span className="text-xs text-slate-500">{record.status}</span>
              </div>
              <div className="text-xs text-slate-500">
                数据集数：{record.datasetCount} · 大小：{record.size}
              </div>
            </div>
          ))}
          {records.length === 0 && (
            <div className="text-sm text-slate-500">暂无备份记录</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackupPage;
