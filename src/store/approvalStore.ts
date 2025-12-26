import { create } from "zustand";
import { nanoid } from "nanoid";
import { ApprovalEntry, DatasetStatus, Role } from "../types";
import { storage } from "../utils/storage";

interface ApprovalState {
  entries: ApprovalEntry[];
  load: () => Promise<void>;
  addEntry: (
    datasetId: string,
    action: DatasetStatus,
    actor: string,
    role: Role,
    note: string
  ) => Promise<void>;
}

const STORAGE_KEY = "approval-entries";

export const useApprovalStore = create<ApprovalState>((set, get) => ({
  entries: [],
  load: async () => {
    const stored = await storage.get<ApprovalEntry[]>(STORAGE_KEY, []);
    set({ entries: stored ?? [] });
  },
  addEntry: async (datasetId, action, actor, role, note) => {
    const newEntry: ApprovalEntry = {
      id: nanoid(),
      datasetId,
      action: action === "Submitted" ? "Submitted" : action,
      actor,
      role,
      note,
      time: new Date().toISOString()
    };
    const entries = [newEntry, ...get().entries];
    await storage.set(STORAGE_KEY, entries);
    set({ entries });
  }
}));
