import { createRouter, createWebHistory } from "vue-router";
import Index from "../views/index.vue";
import Welcome from "../views/welcome.vue";

const routes = [
  { path: "/", component: Welcome },
  { path: "/index", component: Index },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
