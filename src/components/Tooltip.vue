<script setup lang="ts">
// Interface para a tooltip, ela envolverá o botão e instanciará a tooltip
interface Props {
  text: string
  position: 'top' | 'bottom'
}

const props = withDefaults(defineProps<Props>(), {
  text: 'String',
  position: 'top',
})
</script>
<template>
  <div class="relative group inline-block">
    <slot></slot>

    <!-- Tooltip content-->
    <div
      class="absolute w-fit min-w-16 left-1/2 right-1/2 -translate-x-1/2 translate-y-1 group-hover:translate-y-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-card text-foreground text-xs rounded py-2 px-3 pointer-events-none"
    >
      <!-- Arrow -->
      <div
        :class="`absolute ${props.position === 'top' ? 'bottom' : 'bottom'}-full left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-${props.position === 'bottom' ? 't' : 'b'}-[6px] border-${props.position === 'top' ? 'b' : 't'}-card`"
      ></div>
      {{ text }}
    </div>
  </div>
</template>
