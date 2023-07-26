import axios from 'axios'

export const STORAGE_KEY_ACCESS_TOKEN = 'access'

const api = axios.create({
  baseURL: import.meta.env.VITE_ROOT_URL,
  timeout: import.meta.env.VITE_TIMEOUT_MS || 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// 共通処理
api.interceptors.request.use((config) => {
  // 認証トークンがあればリクエストヘッダに加える
  const token = localStorage.getItem(STORAGE_KEY_ACCESS_TOKEN)
  if (token) {
    config.headers.Authorization = `JWT ${token}`
  }
  return config
})

// 共通後処理
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // エラーの種類に応じたハンドリング
    switch (error.response?.status) {
      // バリデーションエラー
      case 400: {
        const messages = Object.values(error.response.data).flat()
        return Promise.reject({ level: 'warning', messages: messages })
      }

      // 認証エラー
      case 401: {
        if (localStorage.getItem(STORAGE_KEY_ACCESS_TOKEN)) {
          localStorage.removeItem(STORAGE_KEY_ACCESS_TOKEN)
          return Promise.reject(new Error('ログイン有効期限切れです。'))
        } else {
          return Promise.reject(new Error('認証エラーです。'))
        }
      }

      // 権限エラー
      case 403: {
        return Promise.reject(new Error('権限エラーです。'))
      }

      // その他のエラー
      default: {
        return Promise.reject(new Error('想定外のエラーが発生しました。'))
      }
    }
  }
)

export default api
