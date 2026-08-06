import { defineStore } from 'pinia';

interface User {
  id: number;
  username: string;
  role: 'admin' | 'customer';
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),

  getters: {
    isLoggedIn: (state) => state.user !== null,
    isAdmin: (state) => state.user?.role === 'admin',
    isCustomer: (state) => state.user?.role === 'customer',
  },

  actions: {
    login(user: User) {
      this.user = user;
    },

    logout() {
      this.user = null;
      this.token = null;
    },
  },
});