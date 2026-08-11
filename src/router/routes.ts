import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/login' },

      { path: 'login', component: () => import('@/pages/LoginPage.vue') },
      { path: 'signup', component: () => import('@/pages/SignupPage.vue') },
      { path: 'dashboard', component: () => import('@/pages/DashboardPage.vue') },
      { path: 'admin', component: () => import('@/pages/AdminPage.vue') },
      {
  path: 'booking/:id',
  component: () => import('@/pages/BookingPage.vue'),
},

      // Add this
      { path: 'facilities', component: () => import('@/pages/FacilitiesPage.vue') },
      {
        path: 'history',
        component: () => import('@/pages/BookingHistoryPage.vue'),
      },
{ 
  path: '/how-it-works', 
  component: () => import('@/pages/HowItWorksPage.vue'),
    meta: { 
      requiresAuth: true,
      role: 'customer'
     },
   },
      {
  path: "pricing-rules",
  component: () => import("@/pages/PricingRulesPage.vue"),
},
{
  path: "admin/bookings",
  component: () => import("@/pages/BookingsDashboardPage.vue"),
},
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },


];

export default routes;