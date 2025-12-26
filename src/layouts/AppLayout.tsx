import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Role } from "../types";
import { useRouteAnalytics } from "../utils/analytics";

const menuByRole: Record<Role, { label: string; path: string }[]> = {
  Admin: [
    { label: "仪表盘", path: "/app/dashboard" },
    { label: "数据集", path: "/app/datasets" },
    { label: "数据清洗", path: "/app/cleaning" },
    { label: "审批流", path: "/app/approval" },
    { label: "NDVI", path: "/app/ndvi" },
    { label: "模型管理", path: "/app/models" },
    { label: "推理", path: "/app/inference" },
    { label: "地图探索", path: "/app/explore" },
    { label: "报告", path: "/app/reports" },
    { label: "备份", path: "/app/backup" },
    { label: "统计", path: "/app/analytics" }
  ],
  Reviewer: [
    { label: "仪表盘", path: "/app/dashboard" },
    { label: "审批流", path: "/app/approval" },
    { label: "NDVI", path: "/app/ndvi" },
    { label: "推理", path: "/app/inference" },
    { label: "地图探索", path: "/app/explore" },
    { label: "报告", path: "/app/reports" }
  ],
  User: [
    { label: "仪表盘", path: "/app/dashboard" },
    { label: "数据集", path: "/app/datasets" },
    { label: "数据清洗", path: "/app/cleaning" },
    { label: "NDVI", path: "/app/ndvi" },
    { label: "地图探索", path: "/app/explore" },
    { label: "报告", path: "/app/reports" }
  ]
};

export const AppLayout: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  useRouteAnalytics();

  const menu = user ? menuByRole[user.role] : [];

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-slate-900 text-white flex flex-col">
        <div className="px-4 py-6 text-lg font-semibold">城市植被平台</div>
        <nav className="flex-1 px-4 space-y-2">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm ${
                  isActive ? "bg-primary-500" : "hover:bg-slate-800"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-800 px-4 py-4 text-xs">
          <div className="mb-2">当前角色：{user?.role}</div>
          <button
            className="w-full rounded bg-slate-700 py-2"
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
          >
            退出登录
          </button>
        </div>
      </aside>
      <div className="flex-1">
        <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
          <div>
            <div className="text-sm text-slate-500">城市植被覆盖率统计</div>
            <div className="text-lg font-semibold">{user?.username}</div>
          </div>
          <div className="text-xs text-slate-400">Mock 数据演示环境</div>
        </header>
        <main className="px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
