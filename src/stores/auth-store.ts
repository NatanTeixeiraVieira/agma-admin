import { LoginResponse } from '@/types/auth';
import Cookies from 'js-cookie';
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
  const authString = Cookies.get('auth');
  const auth = authString ? JSON.parse(authString) : null;
  return {
    state: { auth },
    actions: {
      login: (loginResponse) => {
        Cookies.set('auth', JSON.stringify(loginResponse), {
          expires: 1, // 1 day
        });
        set((state) => ({
          ...state,
          state: { ...state.state, auth: loginResponse },
        }));
        return true;
      },

      logout: () => {
        Cookies.remove('auth');
        set((state) => ({
          ...state,
          state: { ...state.state, auth: null },
        }));
      },
    },
  };
});
