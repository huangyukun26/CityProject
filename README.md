# 城市植被覆盖率统计及可视化（前端 Mock 演示）

本项目为“仅前端、无后端”的可运行演示系统，提供完整的页面、流程与交互，但所有数据/计算/审批/模型/备份均为 Mock。

## 项目结构
```
.
├── index.html
├── package.json
├── playwright.config.ts
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── src
    ├── api
    │   └── mockClient.ts
    ├── components
    │   ├── Chart.tsx
    │   ├── ProtectedRoute.tsx
    │   └── Toast.tsx
    ├── e2e
    │   └── user-flow.spec.ts
    ├── layouts
    │   └── AppLayout.tsx
    ├── mocks
    │   ├── admin-areas.geojson
    │   ├── datasets.json
    │   ├── models.json
    │   └── vegetation-types.json
    ├── pages
    │   ├── AnalyticsPage.tsx
    │   ├── ApprovalPage.tsx
    │   ├── BackupPage.tsx
    │   ├── CleaningPage.tsx
    │   ├── DashboardPage.tsx
    │   ├── DatasetDetailPage.tsx
    │   ├── DatasetsPage.tsx
    │   ├── ExplorePage.tsx
    │   ├── InferencePage.tsx
    │   ├── LoginPage.tsx
    │   ├── ModelsPage.tsx
    │   ├── NDVIPage.tsx
    │   ├── NotFoundPage.tsx
    │   └── ReportsPage.tsx
    ├── store
    │   ├── analyticsStore.ts
    │   ├── approvalStore.ts
    │   ├── authStore.ts
    │   └── datasetStore.ts
    ├── tests
    │   ├── approvalFlow.test.tsx
    │   ├── authGuard.test.tsx
    │   ├── ndvi.test.ts
    │   ├── report.test.ts
    │   └── setup.ts
    ├── types
    │   └── index.ts
    ├── utils
    │   ├── analytics.ts
    │   ├── csv.ts
    │   ├── ndvi.ts
    │   ├── report.ts
    │   └── storage.ts
    ├── App.tsx
    ├── main.tsx
    └── styles.css
```

## 关键依赖
- Vite + React + TypeScript
- TailwindCSS
- React Router
- Zustand
- ECharts
- Leaflet
- Vitest + React Testing Library
- Playwright
- ESLint + Prettier

## 安装与启动
```bash
npm install
npm run dev
```

## 构建
```bash
npm run build
```

## 测试
```bash
npm run test
npm run e2e
```

## 功能演示路径（建议顺序）
1. **登录**：/login 选择角色（Admin/Reviewer/User）进入。
2. **数据集**：/app/datasets 新建数据集、进入详情上传文件。
3. **提交审核**：数据集详情点击“提交审核”。
4. **审批流**：以 Reviewer 角色进入 /app/approval 审批并查看时间线。
5. **NDVI 计算**：/app/ndvi 选择数据集与 CSV/影像，点击“计算 NDVI”。
6. **模型推理**：/app/inference 选择模型版本与影像，查看日志与结果。
7. **地图探索**：/app/explore 查看底图、行政区与统计面板。
8. **报告生成**：/app/reports 选择模板与图表导出 PDF。
9. **备份**：/app/backup 进行手动备份下载。
10. **统计**：/app/analytics 查看访问与角色占比。

## Mock 数据说明
- `src/mocks/datasets.json`：示例数据集
- `src/mocks/models.json`：模型版本
- `src/mocks/admin-areas.geojson`：行政区边界
- `src/mocks/vegetation-types.json`：植被类型字典

## 常见问题排查
- **地图不显示**：检查网络是否可访问 OpenStreetMap 瓦片服务。
- **E2E 报错下载**：确保浏览器允许下载，或切换 `npm run e2e -- --project=chromium`。
- **Tailwind 样式未生效**：确认 `src/styles.css` 已在 `main.tsx` 引入。
