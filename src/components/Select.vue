<script setup lang="ts">
import ChevronDownIcon from '@/assets/icons/chevron-down.svg?component'

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
</script>

<template>
  <div class="mb-5 flex w-full max-w-2xl flex-col space-y-2">
    <label
      :for="id"
      class="text-foreground ml-1 text-sm"
    >
      {{ label }}
    </label>
    <div class="relative flex items-center">
      <select
        :id="id"
        v-model="model"
        class="pr-10"
      >
        <option value="" disabled selected class="disabled:text-foreground/40">
          {{ placeholder }}
        </option>
        <option
          v-for="value in optionsList"
          :key="value"
          :value="value"
        >
          {{ value }}
        </option>
      </select>
      <!-- Arrow -->
      <ChevronDownIcon class="absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2" />
    </div>
  </div>
</template>
