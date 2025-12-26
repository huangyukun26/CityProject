import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { AppLayout } from "./layouts/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DatasetsPage from "./pages/DatasetsPage";
import DatasetDetailPage from "./pages/DatasetDetailPage";
import CleaningPage from "./pages/CleaningPage";
import ApprovalPage from "./pages/ApprovalPage";
import NDVIPage from "./pages/NDVIPage";
import ModelsPage from "./pages/ModelsPage";
import InferencePage from "./pages/InferencePage";
import ExplorePage from "./pages/ExplorePage";
import ReportsPage from "./pages/ReportsPage";
import BackupPage from "./pages/BackupPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useDatasetStore } from "./store/datasetStore";
import { useApprovalStore } from "./store/approvalStore";
import { useAnalyticsStore } from "./store/analyticsStore";

const App: React.FC = () => {
  const loadAuth = useAuthStore((state) => state.load);
  const loadDatasets = useDatasetStore((state) => state.load);
  const loadApprovals = useApprovalStore((state) => state.load);
  const loadAnalytics = useAnalyticsStore((state) => state.load);

  useEffect(() => {
    void loadAuth();
    void loadDatasets();
    void loadApprovals();
    void loadAnalytics();
  }, [loadAuth, loadDatasets, loadApprovals, loadAnalytics]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="datasets" element={<DatasetsPage />} />
        <Route path="datasets/:id" element={<DatasetDetailPage />} />
        <Route path="cleaning" element={<CleaningPage />} />
        <Route
          path="approval"
          element={
            <ProtectedRoute roles={["Reviewer", "Admin"]}>
              <ApprovalPage />
            </ProtectedRoute>
          }
        />
        <Route path="ndvi" element={<NDVIPage />} />
        <Route
          path="models"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <ModelsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="inference"
          element={
            <ProtectedRoute roles={["Admin", "Reviewer"]}>
              <InferencePage />
            </ProtectedRoute>
          }
        />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route
          path="backup"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <BackupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
