import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Role } from "../types";
import { useAuthStore } from "../store/authStore";
import { mockClient } from "../api/mockClient";
import { useToast } from "../components/Toast";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("User");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const { notify } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await mockClient.request(true, { delay: 600, failRate: 0.05 });
      await login(username || "访客", role);
      notify("登录成功", "success");
      navigate("/app/dashboard");
    } catch (error) {
      notify("登录失败，请重试", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-semibold">城市植被覆盖率平台</h1>
        <p className="mt-2 text-sm text-slate-500">Mock 登录即可进入演示系统</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm" htmlFor="username">
              用户名
            </label>
            <input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
              placeholder="请输入用户名"
            />
          </div>
          <div>
            <label className="text-sm" htmlFor="password">
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
              placeholder="任意密码"
            />
          </div>
          <div>
            <label className="text-sm" htmlFor="role">
              角色
            </label>
            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
              className="mt-1 w-full rounded border px-3 py-2"
            >
              <option value="Admin">管理员 Admin</option>
              <option value="Reviewer">审核员 Reviewer</option>
              <option value="User">普通用户 User</option>
            </select>
          </div>
          <button
            disabled={loading}
            className="w-full rounded bg-primary-500 py-2 text-white"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
