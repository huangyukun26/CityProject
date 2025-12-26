import { create } from "zustand";
import { nanoid } from "nanoid";
import { Dataset, DatasetStatus, UploadFile } from "../types";
import { storage } from "../utils/storage";
import seedDatasets from "../mocks/datasets.json";

interface DatasetState {
  datasets: Dataset[];
  load: () => Promise<void>;
  create: (name: string, description: string) => Promise<void>;
  softDelete: (id: string) => Promise<void>;
  addFile: (datasetId: string, file: UploadFile) => Promise<void>;
  updateStatus: (id: string, status: DatasetStatus) => Promise<void>;
  updateFileProgress: (datasetId: string, fileId: string, progress: number) => void;
}

const STORAGE_KEY = "datasets";

const initial = seedDatasets as Dataset[];

export const useDatasetStore = create<DatasetState>((set, get) => ({
  datasets: [],
  load: async () => {
    const stored = await storage.get<Dataset[]>(STORAGE_KEY, initial);
    set({ datasets: stored ?? initial });
  },
  create: async (name, description) => {
    const newDataset: Dataset = {
      id: nanoid(),
      name,
      description,
      createdAt: new Date().toISOString(),
      status: "Draft",
      files: []
    };
    const datasets = [newDataset, ...get().datasets];
    await storage.set(STORAGE_KEY, datasets);
    set({ datasets });
  },
  softDelete: async (id) => {
    const datasets = get().datasets.map((item) =>
      item.id === id ? { ...item, deleted: true } : item
    );
    await storage.set(STORAGE_KEY, datasets);
    set({ datasets });
  },
  addFile: async (datasetId, file) => {
    const datasets = get().datasets.map((item) =>
      item.id === datasetId ? { ...item, files: [...item.files, file] } : item
    );
    await storage.set(STORAGE_KEY, datasets);
    set({ datasets });
  },
  updateStatus: async (id, status) => {
    const datasets = get().datasets.map((item) =>
      item.id === id ? { ...item, status } : item
    );
    await storage.set(STORAGE_KEY, datasets);
    set({ datasets });
  },
  updateFileProgress: (datasetId, fileId, progress) => {
    const datasets = get().datasets.map((item) => {
      if (item.id !== datasetId) return item;
      return {
        ...item,
        files: item.files.map((file) =>
          file.id === fileId ? { ...file, progress } : file
        )
      };
    });
    storage.set(STORAGE_KEY, datasets);
    set({ datasets });
  }
}));
