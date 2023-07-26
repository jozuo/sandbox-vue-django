<script setup>
defineProps({
  type: String,
  isShow: Boolean
})
</script>

<template>
  <v-alert v-show="isShow" :type="type" density="comfortable" variant="tonal" closable>
    <slot></slot>
  </v-alert>
</template>
