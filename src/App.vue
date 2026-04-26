<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { onMounted } from 'vue'

const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<template>
  <main class="flex h-fit min-h-screen w-full flex-col items-center justify-center pb-8">
    <RouterView />
  </main>
</template>
