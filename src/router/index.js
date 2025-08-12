import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from '@/stores/useAuthStore'

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
    path: "/group/group-create",
    component: () => import("@/views/group/group-create.vue"),
  },
  {
    path: "/group/group-signup/:id",
    component: () => import("@/views/group/group-signup.vue"),
    props: true,
  },
  { path: "/contact", component: () => import("@/views/contact/contact.vue") },
  { path: "/chat", component: () => import("@/views/chat/chat.vue") },
  { path: "/auth/login",  component: () => import("@/views/auth/login.vue"),  meta: { guestsOnly: true } },
  { path: "/auth/signup", component: () => import("@/views/auth/signup.vue"), meta: { guestsOnly: true } },

{
  path: "/article/article",
  component: () => import("@/views/article/article.vue"),
},

{
  path: "/article/preview",
  name: 'ArticlePreview',
  component: () => import("@/views/article/article-detail.vue"),
    props: { isPreview: true }

},

{
  path: '/article/:mode(create|edit)/:postid?',
  name: 'ArticleModify',
  component: () => import('@/views/article/article-create.vue'),
  props: true,
},

{
  path: "/article/:postid",
  name: 'ArticleDetail', // 建議為您的路由加上 name
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
  path: '/member/member-list',
  component: () => import('@/views/member/member-list.vue')
},
  {
    path: "/group/form-preview",
    component: () => import("@/views/group/group-create-preview.vue"),
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

router.beforeEach((to) => {
  const auth = useAuthStore()

  // 需要登入的頁面，但尚未登入 → 轉去登入並帶上 redirect
  if (to.meta.requiresAuth && !auth.isLogin) {
    return { path: '/auth/login', query: { redirect: to.fullPath } }
  }

  // 訪客限定頁（login/signup），已登入者不應再看到 → 轉回首頁（可改成你要的頁）
  if (to.meta.guestsOnly && auth.isLogin) {
    return { path: '/home' }
  }

  return true
})

export default router;
