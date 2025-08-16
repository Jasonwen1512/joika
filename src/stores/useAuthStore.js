import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";

const AUTH_KEY = 'auth:user'

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null)
  const token = ref('')

  const isLogin = computed(() => !!user.value)

  function login(payload) {
    user.value = payload.user
    token.value = payload.token ?? ''
  }

  function logout() {
    user.value = null
    token.value = ''
  }

  // 持久化
  const loadFromStorage = () => {
    const saved = localStorage.getItem(AUTH_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      user.value = parsed.user
      token.value = parsed.token
    }
  }
  loadFromStorage()

  watch([user, token], ([u, t]) => {
    if (u) {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ user: u, token: t }))
    } else {
      localStorage.removeItem(AUTH_KEY)
    }
  })

  return { user, token, isLogin, login, logout }
})
