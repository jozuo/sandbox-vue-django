<script setup>
import { storeToRefs } from 'pinia'
import { useMessageStore } from '../stores/message'
import AppAlert from './AppAlert.vue'

const messageStore = useMessageStore()
const { messages, isError, isWarning, isInfo } = storeToRefs(messageStore)
</script>

<template>
  <v-container id="message">
    <AppAlert type="error" :is-show="isError">{{ messages[0] }}</AppAlert>
    <AppAlert type="warning" :is-show="isWarning">
      <p v-for="message in messages" :key="message">
        {{ message }}
      </p>
    </AppAlert>
    <AppAlert type="info" :is-show="isInfo">{{ messages[0] }}</AppAlert>
  </v-container>
</template>

<style scoped>
#message {
  min-height: 110px;
}
</style>
