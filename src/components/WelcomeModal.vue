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
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <!-- Modal content -->
      <div
        class="entrance-animation bg-card! border-border w-full max-w-lg overflow-clip border shadow-lg"
      >
        <div
          class="from-primary h-80 bg-linear-to-t to-transparent mask-b-to-100% bg-cover bg-center"
          :style="{
            animationDelay: '200ms',
            background: 'no-repeat top center/100% url(/img/modal-welcome-gray.png)',
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
          }"
        ></div>
        <div class="p-6 text-center">
          <h2
            class="entrance-animation mb-4 font-bold *:text-2xl"
            style="animationDelay: 300ms"
          >
            {{ title }}
          </h2>
          <p
            class="entrance-animation text-foreground mb-6"
            style="animationDelay: 500ms"
          >
            {{ description }}
          </p>
          <button
            @click="$emit('close')"
            class="entrance-animation btn-primary w-full font-medium"
            style="animationDelay: 800ms"
          >
            Entendi!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css">
@keyframes fade-in-slide {
  from {
    opacity: 0;
    transform: translateY(5%);
  }
  to {
    opacity: 1;
    transform: translateY(0%);
  }
}

.entrance-animation {
  opacity: 0;
  will-change: transform, opacity;
  animation: fade-in-slide 0.9s ease forwards;
}
</style>
