<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useMessageStore } from '@/stores/message'
import { useRouter } from 'vue-router'
import { VListItemTitle } from 'vuetify/lib/components/index.mjs'

const authStore = useAuthStore()
const { nickname, isLoggedIn } = storeToRefs(authStore)

const messageStore = useMessageStore()
const router = useRouter()

const login = () => {
  messageStore.clear()
  router.replace({ name: 'login' })
}

const logout = () => {
  messageStore.clear()
  authStore.logout()
  messageStore.setInfoMessage('ログアウトしました。')
  router.replace({ name: 'login' })
}
</script>

<template>
  <v-app-bar id="header" color="grey-darken-2">
    <v-app-bar-title>
      <v-btn href="/">DRF Sample</v-btn>
    </v-app-bar-title>
    <template v-slot:append v-if="$route.meta.requiresAuth">
      <!-- 条件分岐 -->
      <v-btn v-if="isLoggedIn">
        {{ nickname }}
        <v-menu activator="parent">
          <v-list>
            <v-list-item>
              <v-list-item-title>
                <v-btn variant="flat" href="#" @click="logout">ログアウト</v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <v-btn v-else href="#" @click="login">ログイン</v-btn>
    </template>
  </v-app-bar>
</template>
