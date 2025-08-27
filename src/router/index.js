import { createRouter, createWebHistory } from "vue-router";
import { authState, isAuthenticated, fetchMe } from '@/assets/data/authState'

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
    meta: { requiresAuth: true }
  },
  {
    path: "/member/member-content",
    component: () => import("@/views/member/member-content.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/group/group-explore",
    component: () => import("@/views/group/group-explore.vue"),
  },

  {
    path: "/group/:mode(create|preview|edit)/:activity_no?",
    name: "group-create",
    component: () => import("@/views/group/group-create.vue"),
    props: true,
    meta: { requiresAuth: true },
  },

  {
    path: "/group/group-signup/:id",
    component: () => import("@/views/group/group-signup.vue"),
    props: true,
  },
  { path: "/contact", component: () => import("@/views/contact/contact.vue") },
  { path: "/chat", component: () => import("@/views/chat/chat.vue"),meta: { requiresAuth: true } },
  
  { path: "/auth/login",
    name: "login",
    component: () => import("@/views/auth/login.vue"),
    props: route => ({ redirect: route.query.redirect || '/home' }) },

  { path: "/auth/signup",
    name: "signup", 
    component: () => import("@/views/auth/signup.vue"),
    meta: { guestOnly: true }},
  { path: "/auth/profile-update",
    name: "profileUpdate", 
    component: () => import("@/views/auth/profile-update.vue"),
    meta: { requiresAuth: true }},

  {
    path: "/article/article",
    component: () => import("@/views/article/article.vue"),
  },

  {
    path: "/article/preview",
    name: "ArticlePreview",
    component: () => import("@/views/article/article-detail.vue"),
    props: { isPreview: true },
  },

  {
    path: "/article/:mode(create|edit)/:postid?",
    name: "ArticleModify",
    component: () => import("@/views/article/article-create.vue"),
    props: true,
    meta: { requiresAuth: true },
  },

  {
    path: "/article/:postid",
    name: "ArticleDetail", // 建議為您的路由加上 name
    component: () => import("@/views/article/article-detail.vue"),
  },

  {
    path: "/activity",
    component: () => import("@/views/activity/activity.vue"),
  },

  {
    path: "/activity/:activity_id",
    component: () => import("@/views/activity/activity-detail.vue"),
  },

  { 
    path: '/front/member/member-list/:id?',
    name: 'member-member-list',
    component: () => import("@/views/member/member-list.vue"),
    props: true,
  },

  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("@/views/404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory("/cjd101/g2/front/"),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 總是滾動到頂部
    return { left: 0, top: 0 };
  },
});

export default router;

let checkedOnce = false
async function ensureAuthReady() {
  if (!checkedOnce) { checkedOnce = true; await fetchMe() }
  else if (!authState.ready) { await fetchMe() }
}


router.beforeEach(async (to) => {
  await ensureAuthReady()

  const needsLogin = to.matched.some(r => r.meta?.requiresAuth)
  if (needsLogin && !isAuthenticated.value) {
    // [CHANGE] 改為回傳導向（v4 推薦）
    return { name: 'login', query: { redirect: to.fullPath } } // or path: '/auth/login'
  }

  // [ADD] 使用 meta.guestOnly：已登入就不要進登入/註冊
  const guestOnly = to.matched.some(r => r.meta?.guestOnly)
  if (guestOnly && isAuthenticated.value) {
    const back = (typeof to.query.redirect === 'string' && to.query.redirect) ? to.query.redirect : '/home'
    return back // 或 return { path: back }
  }

  return true // 放行
  })