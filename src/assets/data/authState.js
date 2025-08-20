import { reactive, computed } from "vue";

export const authState = reactive({ user: null, ready: false });
export const isAuthenticated = computed(() => !!authState.user);

export async function fetchMe() {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/users/me.php`, {
        credentials: "include",
        });
        const data = await res.json();
        authState.user = data.authenticated ? data.user : null;
    } finally {
        authState.ready = true;
    }
}

export async function loginByPhonePassword({ phone, password }) {
    const body = new URLSearchParams({ member_phone: phone, password });
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/users/login.php`, {
        method: "POST",
        body,
        credentials: "include",
    });
    const data = await res.json();
    if (data.code === "0003") {
        authState.user = data.user_data;
        return { ok: true };
    }
    return { ok: false, data };
}

export async function logout() {
    await fetch(`${import.meta.env.VITE_API_BASE}/users/logout.php`, {
        credentials: "include",
    });
    authState.user = null;
}
