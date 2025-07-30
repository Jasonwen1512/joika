import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/views/welcome/welcome.vue"),
    meta: { hideLayout: true },
  },
  { path: "/home", component: () => import("@/views/home/home.vue") },
  { path: "/support", component: () => import("@/views/support/support.vue") },
  {
    path: "/member/member-notify",
    component: () => import("@/views/member/member-notify.vue"),
  },
  {
    path: "/member/member-content",
    component: () => import("@/views/member/member-content.vue"),
  },
  {
    path: "/group/group-explore",
    component: () => import("@/views/group/group-explore.vue"),
  },
  {
    path: "/group/group-create",
    component: () => import("@/views/group/group-create.vue"),
  },
  { path: "/concat", component: () => import("@/views/concat/concat.vue") },
  { path: "/chat", component: () => import("@/views/chat/chat.vue") },
  { path: "/auth/login", component: () => import("@/views/auth/login.vue") },
  { path: "/auth/signup", component: () => import("@/views/auth/signup.vue") },
  {
    path: "/article/article",
    component: () => import("@/views/article/article.vue"),
  },
  {
    path: "/article/:postid",
    component: () => import("@/views/article/article-detail.vue"),
  },
  {
    path: "/article/article-create",
    component: () => import("@/views/article/article-create.vue"),
  },
  {
    path: "/activity",
    component: () => import("@/views/activity/activity.vue"),
  },

  {
    path: "/activity/:activity_id",
    component: () => import("@/views/activity/activity-detail.vue"),
  },


  
];

const router = createRouter({
  history: createWebHistory("/cjd101/g2/front/"),
  routes,
});

export default router;