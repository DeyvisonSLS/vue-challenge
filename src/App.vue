<script setup lang="ts">
import Login from './views/Login.vue'
import { useTheme } from '@/composables/useTheme'
import { onMounted } from 'vue'

const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<template>
  <main class="flex flex-col h-screen w-screen items-center justify-center">
    <RouterView />
  </main>
</template>
