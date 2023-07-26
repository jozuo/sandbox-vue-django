import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMessageStore = defineStore('message', () => {
  const level = ref(null)
  const messages = ref([])

  const isError = computed(() => {
    return level.value === 'error'
  })

  const isWarning = computed(() => {
    return level.value === 'warning'
  })

  const isInfo = computed(() => {
    return level.value === 'info'
  })

  const setError = (errorObj) => {
    level.value = errorObj.level || 'error'
    messages.value = errorObj.messages || [errorObj.message]
  }

  const setErrorMessage = (message) => {
    level.value = 'error'
    messages.value = [message]
  }

  const setWarningMessage = (message) => {
    level.value = 'warning'
    messages.value = [message]
  }

  const setInfoMessage = (message) => {
    level.value = 'info'
    messages.value = [message]
  }

  const clear = () => {
    level.value = null
    messages.value = []
  }
  return {
    messages,
    isError,
    isWarning,
    isInfo,
    setError,
    setErrorMessage,
    setWarningMessage,
    setInfoMessage,
    clear
  }
})
