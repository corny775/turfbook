import { defineRouter } from '#q-app';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import { useAuthStore } from '@/stores/auth';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // Login and signup are public
  if (to.path === '/login' || to.path === '/signup') {
    if (auth.isLoggedIn) {
      if (auth.isAdmin) {
        return next('/admin');
      } else {
        return next('/dashboard');
      }
    }

    return next();
  }

  // Block unauthenticated users
  if (!auth.isLoggedIn) {
    return next('/login');
  }

  // ADMIN-ONLY pages
  if (
    to.path === '/admin' ||
    to.path === '/admin/bookings' ||
    to.path === '/pricing-rules'
  ) {
    if (!auth.isAdmin) {
      return next('/dashboard');
    }

    return next();
  }

  // CUSTOMER-ONLY pages
  if (
    to.path === '/dashboard' ||
    to.path === '/facilities' ||
    to.path.startsWith('/booking/') ||
    to.path === '/history'
  ) {
    if (!auth.isCustomer) {
      return next('/admin');
    }

    return next();
  }

  next();
});

  return Router;
});
