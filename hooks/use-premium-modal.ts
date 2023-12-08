import { create } from "zustand";

type PremiumModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const usePremiumModal = create<PremiumModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
