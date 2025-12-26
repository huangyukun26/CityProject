import React, { useMemo, useState } from "react";
import { useDatasetStore } from "../store/datasetStore";
import { useApprovalStore } from "../store/approvalStore";
import { useAuthStore } from "../store/authStore";
import { useToast } from "../components/Toast";

const ApprovalPage: React.FC = () => {
  const datasets = useDatasetStore((state) => state.datasets);
  const updateStatus = useDatasetStore((state) => state.updateStatus);
  const entries = useApprovalStore((state) => state.entries);
  const addEntry = useApprovalStore((state) => state.addEntry);
  const user = useAuthStore((state) => state.user);
  const { notify } = useToast();
  const [note, setNote] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const pending = datasets.filter((item) => item.status === "Submitted");
  const timeline = useMemo(
    () => entries.filter((entry) => entry.datasetId === selectedId),
    [entries, selectedId]
  );

  const handleAction = async (status: "Approved" | "Rejected") => {
    if (!user || !selectedId) return;
    await updateStatus(selectedId, status);
    await addEntry(selectedId, status, user.username, user.role, note || "审核" );
    notify(`已${status === "Approved" ? "通过" : "驳回"}`, "success");
    setNote("");
  };

  return (
    <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
      <div className="rounded bg-white p-4 shadow">
        <h2 className="text-lg font-semibold">待审核列表</h2>
        <div className="mt-4 space-y-3">
          {pending.map((dataset) => (
            <button
              key={dataset.id}
              className={`w-full rounded border px-4 py-3 text-left ${
                selectedId === dataset.id ? "border-primary-500" : "border-slate-200"
              }`}
              onClick={() => setSelectedId(dataset.id)}
            >
              <div className="text-sm text-slate-500">{dataset.description}</div>
              <div className="text-lg font-semibold">{dataset.name}</div>
              <div className="text-xs text-slate-400">文件数量 {dataset.files.length}</div>
            </button>
          ))}
          {pending.length === 0 && (
            <div className="text-sm text-slate-500">暂无待审核数据集</div>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded bg-white p-4 shadow">
          <h3 className="text-md font-semibold">审批操作</h3>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="mt-3 w-full rounded border px-3 py-2 text-sm"
            placeholder="填写审批意见"
          />
          <div className="mt-3 flex gap-2">
            <button
              className="flex-1 rounded bg-emerald-500 py-2 text-white"
              onClick={() => handleAction("Approved")}
              disabled={!selectedId}
            >
              通过
            </button>
            <button
              className="flex-1 rounded bg-rose-500 py-2 text-white"
              onClick={() => handleAction("Rejected")}
              disabled={!selectedId}
            >
              驳回
            </button>
          </div>
        </div>
        <div className="rounded bg-white p-4 shadow">
          <h3 className="text-md font-semibold">审批时间线</h3>
          <div className="mt-3 space-y-3 text-sm">
            {timeline.map((entry) => (
              <div key={entry.id} className="rounded border p-3">
                <div className="text-xs text-slate-500">{entry.action}</div>
                <div>{entry.actor} · {entry.role}</div>
                <div className="text-xs text-slate-400">{new Date(entry.time).toLocaleString()}</div>
                <div className="text-xs">{entry.note}</div>
              </div>
            ))}
            {selectedId && timeline.length === 0 && (
              <div className="text-xs text-slate-500">暂无审批记录</div>
            )}
            {!selectedId && (
              <div className="text-xs text-slate-500">请选择数据集</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalPage;
