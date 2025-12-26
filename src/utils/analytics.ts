import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAnalyticsStore } from "../store/analyticsStore";

export const useRouteAnalytics = () => {
  const location = useLocation();
  const track = useAnalyticsStore((state) => state.track);

  useEffect(() => {
    track("route", location.pathname);
  }, [location.pathname, track]);
};
