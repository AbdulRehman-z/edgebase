import { create } from "zustand";

type State = {
  open: boolean;
};

type Actions = {
  toggleOpen: () => void;
};

export const useSidebarState = create<State & Actions>((set) => ({
  open: true,
  toggleOpen: () => set((state) => ({ open: !state.open })),
}));
