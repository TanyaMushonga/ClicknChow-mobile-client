import { AuthUser } from "@/types/users";
import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  userData: AuthUser | null;
  showAuthModal: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setUserData: (data: AuthUser | null) => void;
  setShowAuthModal: (show: boolean) => void;
  login: (userData: AuthUser) => void;
  logout: () => void;
}

export const useIsAuthenticated = create<AuthState>((set) => ({
  isAuthenticated: false,
  userData: null,
  showAuthModal: false,
  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  setUserData: (data: AuthUser | null) => set({ userData: data }),
  setShowAuthModal: (show: boolean) => set({ showAuthModal: show }),
  login: (userData: AuthUser) =>
    set({ isAuthenticated: true, userData, showAuthModal: false }),
  logout: () => set({ isAuthenticated: false, userData: null }),
}));
