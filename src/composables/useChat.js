import { ref, nextTick, watch, onUnmounted } from 'vue'
import { db } from '@/lib/firebase'
import {
    collection, addDoc, serverTimestamp, query,
    orderBy, limit, onSnapshot, startAfter, getDocs
} from 'firebase/firestore'

export function useChat(uidRef) {
    const messages = ref([])
    const loadingMore = ref(false)
    const pageSize = 30
    const boxRef = ref(null)
    let unsub = null
    let lastVisible = null

    const col = collection(db, 'messages')

    const listen = () => {
        if (unsub) unsub()
        messages.value = []
        lastVisible = null

        const q = query(col, orderBy('createdAt', 'desc'), limit(pageSize))
        unsub = onSnapshot(q, snap => {
            const list = snap.docs
                .map(d => ({ id: d.id, ...d.data(), senderId: String(d.data().senderId) }))
                .filter(d => d.createdAt)
                .reverse()

            messages.value = list
            lastVisible = snap.docs[snap.docs.length - 1] || null
            scrollToBottomSoon()
        })
    }

    const loadMore = async () => {
        if (loadingMore.value || !lastVisible) return
        loadingMore.value = true
        try {
            const q = query(col, orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(pageSize))
            const snap = await getDocs(q)
            const list = snap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter(d => d.createdAt)
                .reverse()

            messages.value = list.concat(messages.value)
            lastVisible = snap.docs[snap.docs.length - 1] || null
        } finally {
            loadingMore.value = false
        }
    }

    //關鍵修改：send 函式現在接收一個物件
    const send = async (messageObj) => {
        if (!messageObj || !messageObj.text || !messageObj.senderId) {
            console.error('無效的訊息物件', messageObj)
            return
        }

        const text = messageObj.text.trim()
        const senderId = String(messageObj.senderId)
        const senderName = messageObj.senderName || '匿名'
        const senderAvatar = messageObj.senderAvatar || ''

        if (!text) return

        try {
            await addDoc(col, {
                text,
                createdAt: serverTimestamp(),
                senderId,
                senderName,
                senderAvatar
            })
        } catch (err) {
            console.error('送出失敗', err)
            alert('送出失敗，請確認 Firebase 設定或網路連線')
        }
    }

    const scrollToBottomSoon = async () => {
        await nextTick()
        const el = boxRef.value
        if (el) el.scrollTop = el.scrollHeight
    }

    // 初始化並監聽 uidRef 變化
    watch(uidRef, (newUid) => {
        // 當 uidRef 有值時才開始監聽 Firestore
        if (newUid) {
            listen()
        }
    }, { immediate: true })

    // 在元件卸載時取消監聽
    onUnmounted(() => unsub && unsub())

    return { messages, send, loadMore, loadingMore, boxRef }
}