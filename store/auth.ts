import { create } from "zustand";

interface UserData {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  userData: UserData | null;
  showAuthModal: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setUserData: (data: UserData | null) => void;
  setShowAuthModal: (show: boolean) => void;
  login: (userData: UserData) => void;
  logout: () => void;
}

export const useIsAuthenticated = create<AuthState>((set) => ({
  isAuthenticated: false,
  userData: null,
  showAuthModal: false,
  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  setUserData: (data: UserData | null) => set({ userData: data }),
  setShowAuthModal: (show: boolean) => set({ showAuthModal: show }),
  login: (userData: UserData) =>
    set({ isAuthenticated: true, userData, showAuthModal: false }),
  logout: () => set({ isAuthenticated: false, userData: null }),
}));
