<script setup lang="ts">
import ChevronDownIcon from '@/assets/icons/chevron-down.svg?component'
import XIcon from '@/assets/icons/x.svg?component'
import { nextTick, ref } from 'vue'

interface Props {
  label?: string
  id: string
  optionsList: string[]
  placeholder?: string
  required?: boolean
}

// Default props
const defaultProps = withDefaults(defineProps<Props>(), {
  placeholder: 'Insira seu texto aqui...',
  required: false,
})

const model = defineModel<string>()

const selectRef = ref<HTMLSelectElement | null>(null)

// Gerenciando estado do select para animação da seta
const isDropdownOpen = ref(false)
const handleSelected = () => {
  isDropdownOpen.value = false
  nextTick(() => {
    selectRef.value?.blur()
  })
}
</script>

<template>
  <div class="mb-5 flex w-full max-w-2xl flex-col space-y-2">
    <label
      :for="id"
      class="text-foreground pointer-events-none ml-1 text-sm"
    >
      {{ label }}
    </label>
    <div class="relative flex items-center">
      <select
        ref="selectRef"
        :id="id"
        v-model="model"
        class="appearance-none pr-10"
        @change="handleSelected"
        @mousedown="isDropdownOpen = true"
        @blur="isDropdownOpen = false"
      >
        <option
          value=""
          disabled
          selected
          class="disabled:text-foreground/40"
        >
          {{ placeholder }}
        </option>
        <option
          v-for="value in optionsList"
          :key="value"
          :value="value"
          @click="isDropdownOpen = !isDropdownOpen"
        >
          {{ value }}
        </option>
      </select>
      <!-- Arrow -->
      <ChevronDownIcon
        :class="`pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 transition-all ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`"
      />
      <!-- X remove o filtro selecionado-->
      <button
        v-if="model"
        class="absolute top-1/2 right-10 z-200 -translate-y-1/2 cursor-pointer rounded-full bg-white/10! p-1 hover:bg-white/20!"
        @click="model = ''"
      >
        <XIcon class="pointer-events-none h-4 w-4" />
      </button>
    </div>
  </div>
</template>
