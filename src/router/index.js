import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: () => import("@/views/welcome/welcome.vue") },
  { path: "/home", component: () => import("@/views/home/home.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
