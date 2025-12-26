import { create } from "zustand";
import { Role, UserSession } from "../types";
import { storage } from "../utils/storage";

interface AuthState {
  user: UserSession | null;
  login: (username: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  load: () => Promise<void>;
}

const STORAGE_KEY = "auth-session";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (username, role) => {
    const session: UserSession = { username, role };
    await storage.set(STORAGE_KEY, session);
    set({ user: session });
  },
  logout: async () => {
    await storage.remove(STORAGE_KEY);
    set({ user: null });
  },
  load: async () => {
    const session = await storage.get<UserSession>(STORAGE_KEY);
    if (session) {
      set({ user: session });
    }
  }
}));
