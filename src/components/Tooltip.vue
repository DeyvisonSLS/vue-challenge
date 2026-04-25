<script setup lang="ts">
import { computed } from 'vue';

// Interface para a tooltip, ela envolverá o botão e instanciará a tooltip
interface Props {
  text: string
  position: 'top' | 'bottom'
  isActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: 'String',
  position: 'top',
  isActive: true,
})

const arrowClasses = computed(() => {
  const base = 'absolute left-1/2 -translate-x-1/2 border-x-[6px] border-x-transparent'

  const positions = {
    top: 'top-full border-t-[6px] border-t-card',
    bottom: 'bottom-full border-b-[6px] border-b-card',
  }

  return `${base} ${positions[props.position]}`
})
</script>
<template>
  <div class="group relative inline-block">
    <slot></slot>
    <!-- Tooltip content-->
    <div
      v-if="isActive"
      class="bg-card text-foreground pointer-events-none absolute right-1/2 left-1/2 w-max max-w-50 -translate-x-1/2 translate-y-1 rounded px-3 py-2 text-xs opacity-0 transition-all duration-300 group-hover:translate-y-3 group-hover:opacity-100"
    >
      <!-- Arrow -->
      <div
        :class="arrowClasses"
      ></div>
      <p class="w-full text-center">{{ text }}</p>
    </div>
  </div>
</template>
