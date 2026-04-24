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
  <main class="flex h-screen w-screen flex-col items-center justify-center">
    <RouterView />
  </main>
</template>
