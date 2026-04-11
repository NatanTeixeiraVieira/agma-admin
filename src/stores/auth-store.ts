import { LoginResponse } from '@/types/auth';
import { create } from 'zustand';

type AuthState = {
  state: {
    auth: LoginResponse | null;
  };
  actions: {
    login: (loginResponse: LoginResponse) => boolean;
    logout: () => void;
  };
};

export const useAuthStore = create<AuthState>((set) => {
  const authString = localStorage.getItem('auth');
  const auth = authString ? JSON.parse(authString) : null;
  return {
    state: { auth },
    actions: {
      login: (loginResponse) => {
        localStorage.setItem('auth', JSON.stringify(loginResponse));
        set((state) => ({
          ...state,
          state: { ...state.state, auth: loginResponse },
        }));
        return true;
      },

      logout: () => {
        localStorage.removeItem('auth');
        set((state) => ({
          ...state,
          state: { ...state.state, auth: null },
        }));
      },
    },
  };
});
