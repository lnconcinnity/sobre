import { create } from 'zustand';

interface NavState {
    isHeroVisible: boolean;
    setHeroVisible: (visible: boolean) => void;
}

export const useNavStore = create<NavState>((set) => ({
    isHeroVisible: false,
    setHeroVisible: (visible) => set({ isHeroVisible: visible }),
}));