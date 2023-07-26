<script setup>
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalMessage from '@/components/GlobalMessage.vue'
</script>

<template>
  <v-app>
    <GlobalHeader />
    <v-main>
      <GlobalMessage />
      <slot />
    </v-main>
  </v-app>
</template>
