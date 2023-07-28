import { defineStore } from 'pinia'
import { ref } from 'vue'
import api, { STORAGE_KEY_ACCESS_TOKEN } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const nickname = ref('')
  const isLoggedIn = ref(false)

  /**
   * ログイン
   */
  const login = async (_email, _password) => {
    const response = await api.post('/auth/login/', {
      email: _email,
      password: _password
    })

    // アクセストークンの保存
    localStorage.setItem(STORAGE_KEY_ACCESS_TOKEN, response.data.access)

    // ステートの更新
    nickname.value = response.data.user.nickname
    isLoggedIn.value = true
  }

  /**
   * ログアウト
   */
  const logout = () => {
    // アクセストークンの削除
    localStorage.removeItem(STORAGE_KEY_ACCESS_TOKEN)

    // ステートの更新
    nickname.value = ''
    isLoggedIn.value = false
  }

  /**
   * ユーザー情報更新
   */
  const renew = async () => {
    const response = await api('/auth/user/')
    nickname.value = response.data.username
    isLoggedIn.value = true
  }

  return { nickname, isLoggedIn, login, logout, renew }
})
