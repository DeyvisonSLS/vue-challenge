<script setup lang="ts">
interface Props {
  title: string
  description: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Title',
  description: 'This is where the description goes.',
})
</script>
<template lang="">
  <div>
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <!-- Modal content -->
      <div class="bg-card rounded-4xl border border-border shadow-lg w-full max-w-md overflow-clip">
        <div
          class="h-70 mask-b-to-100% bg-linear-to-t from-primary to-transparent bg-[url(img/modal-welcome-gray.png)] bg-cover bg-center"
        ></div>
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-4">{{ title }}</h2>
          <p class="text-foreground mb-6">{{ description }}</p>
          <button
            @click="$emit('close')"
            class="btn-primary w-full font-medium"
          >
            Entendi!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
