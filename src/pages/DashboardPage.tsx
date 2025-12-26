import React from "react";
import { useDatasetStore } from "../store/datasetStore";
import { useApprovalStore } from "../store/approvalStore";

const DashboardPage: React.FC = () => {
  const datasets = useDatasetStore((state) => state.datasets);
  const approvals = useApprovalStore((state) => state.entries);

  const activeDatasets = datasets.filter((item) => !item.deleted);
  const submitted = activeDatasets.filter((item) => item.status === "Submitted");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded bg-white p-4 shadow">
          <div className="text-xs text-slate-500">数据集数量</div>
          <div className="text-2xl font-semibold">{activeDatasets.length}</div>
        </div>
        <div className="rounded bg-white p-4 shadow">
          <div className="text-xs text-slate-500">待审核</div>
          <div className="text-2xl font-semibold">{submitted.length}</div>
        </div>
        <div className="rounded bg-white p-4 shadow">
          <div className="text-xs text-slate-500">审批记录</div>
          <div className="text-2xl font-semibold">{approvals.length}</div>
        </div>
      </div>
      <div className="rounded bg-white p-6 shadow">
        <h2 className="text-lg font-semibold">项目概览</h2>
        <p className="mt-2 text-sm text-slate-500">
          此页面展示当前 Mock 项目整体概况，包括数据集、审批与模型流程状态。
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded border border-dashed p-4">
            <div className="text-sm font-medium">本周 NDVI 计算次数</div>
            <div className="mt-2 text-2xl font-semibold">24</div>
          </div>
          <div className="rounded border border-dashed p-4">
            <div className="text-sm font-medium">模型推理任务</div>
            <div className="mt-2 text-2xl font-semibold">12</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
