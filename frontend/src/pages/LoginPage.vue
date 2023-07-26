<script setup>
import GlobalLayout from '@/layouts/GlobalLayout.vue'
import { ref } from 'vue'
import { useMessageStore } from '@/stores/message'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'

const messageStore = useMessageStore()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')

const route = useRoute()
const router = useRouter()

const login = async () => {
  console.log('call login')
  // メッセージクリア
  messageStore.clear()

  // ログイン
  try {
    await authStore.login(username.value, password.value)
    messageStore.setInfoMessage('ログインしました。')
    // ホーム画面に遷移
    const next = route.query.next || '/'
    router.replace(next)
  } catch (e) {
    messageStore.setError(e)
  }
}
</script>

<template>
  <GlobalLayout>
    <v-container>
      <v-card class="mx-auto pa-8" elevation="4" width="600">
        <v-card-title class="mb-8">ログイン</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="username" label="ユーザー名" required></v-text-field>

            <v-text-field
              v-model="password"
              label="パスワード"
              type="password"
              required
            ></v-text-field>

            <v-card-actions>
              <v-btn
                variant="elevated"
                color="primary"
                class="mx-auto"
                type="submit"
                @click.prevent="login"
                >ログイン</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </GlobalLayout>
</template>
