import { create } from "zustand";

interface AppStore {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  theme: "dark",
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "dark" ? "light" : "dark",
    })),
}));
