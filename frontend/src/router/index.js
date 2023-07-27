import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import BookPage from '@/pages/BookPage.vue'
import DummyPage from '@/pages/DummyPage.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // ログイン画面
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      // 書籍画面
      path: '/book',
      name: 'book',
      component: BookPage,
      meta: { requiresAuth: true } // 要ログイン
    },
    {
      // ダミー画面
      path: '/dummy',
      name: 'dummy',
      component: DummyPage,
      meta: { requiresAuth: true } // 要ログイン
    },
    {
      // 想定外のパスをリダイレクト
      path: '/:pathMatch(.*)*',
      redirect: '/book'
    }
  ]
})

router.beforeEach(async (to) => {
  // ログイン状態を取得
  const authStore = useAuthStore()
  const isLoggedIn = authStore.isLoggedIn

  // 未ログイン状態 かつ ログインが必要な画面に遷移しようとした場合
  if (!isLoggedIn && to.meta.requiresAuth) {
    // ユーザー情報を再取得
    try {
      await authStore.renew()
    } catch (e) {
      // 再取得できない場合はログイン画面に強制遷移
      forceToLoginPage(to)
    }
  }
})

const forceToLoginPage = (to) => {
  router.replace({
    name: 'login',
    query: { next: to.fullPath }
  })
}

export default router
