import { create } from "zustand";
import { nanoid } from "nanoid";
import { storage } from "../utils/storage";

export interface AnalyticsEvent {
  id: string;
  type: "route" | "click";
  label: string;
  time: string;
}

interface AnalyticsState {
  events: AnalyticsEvent[];
  load: () => Promise<void>;
  track: (type: AnalyticsEvent["type"], label: string) => Promise<void>;
}

const STORAGE_KEY = "analytics-events";

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  events: [],
  load: async () => {
    const stored = await storage.get<AnalyticsEvent[]>(STORAGE_KEY, []);
    set({ events: stored ?? [] });
  },
  track: async (type, label) => {
    const event: AnalyticsEvent = {
      id: nanoid(),
      type,
      label,
      time: new Date().toISOString()
    };
    const events = [event, ...get().events].slice(0, 500);
    await storage.set(STORAGE_KEY, events);
    set({ events });
  }
}));
