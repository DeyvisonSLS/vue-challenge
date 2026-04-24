<script setup lang="ts">
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
        :class="`absolute ${props.position === 'top' ? 'bottom' : 'bottom'}-full left-1/2 -translate-x-1/2 border-r-[6px] border-l-[6px] border-r-transparent border-l-transparent border-${props.position === 'top' ? 't' : 'b'}-[6px] border-${props.position === 'bottom' ? 'b' : 't'}-card`"
      ></div>
      <p class="w-full text-center">{{ text }}</p>
    </div>
  </div>
</template>
