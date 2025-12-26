import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-100">
    <div className="rounded bg-white p-6 text-center shadow">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="mt-2 text-sm text-slate-500">页面未找到</p>
      <Link className="mt-4 inline-block rounded bg-primary-500 px-4 py-2 text-white" to="/login">
        返回登录
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
