import { defineStore } from 'pinia'
import { ref } from 'vue'
import api, { STORAGE_KEY_ACCESS_TOKEN } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const username = ref('')
  const isLoggedIn = ref(false)

  /**
   * ログイン
   */
  const login = async (_username, _password) => {
    const response = await api.post('/auth/login/', {
      username: _username,
      password: _password
    })

    // アクセストークンの保存
    localStorage.setItem(STORAGE_KEY_ACCESS_TOKEN, response.data.access)

    // ステートの更新
    username.value = response.data.user.username
    isLoggedIn.value = true
  }

  /**
   * ログアウト
   */
  const logout = () => {
    // アクセストークンの削除
    localStorage.removeItem(STORAGE_KEY_ACCESS_TOKEN)

    // ステートの更新
    username.value = ''
    isLoggedIn.value = false
  }

  /**
   * ユーザー情報更新
   */
  const renew = async () => {
    const response = await api('/auth/user/')
    username.value = response.data.username
    isLoggedIn.value = true
  }

  return { username, isLoggedIn, login, logout, renew }
})
