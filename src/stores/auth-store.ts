import { create } from 'zustand';

type AuthState = {
  state: {
    isAuthenticated: boolean;
  };
  actions: {
    login: (email: string, password: string) => boolean;
    logout: () => void;
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  state: {
    isAuthenticated: localStorage.getItem('ong_auth') === 'true',
  },
  actions: {
    login: (email, password) => {
      if (email && password) {
        localStorage.setItem('ong_auth', 'true');
        set((state) => ({
          ...state,
          state: { ...state.state, isAuthenticated: true },
        }));
        return true;
      }
      return false;
    },
    logout: () => {
      localStorage.removeItem('ong_auth');
      set((state) => ({
        ...state,
        state: { ...state.state, isAuthenticated: false },
      }));
    },
  },
}));
