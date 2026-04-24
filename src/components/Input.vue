<script setup lang="ts">
import MailIcon from '@/assets/mail.svg?component'
import PasswordIcon from '@/assets/lock.svg?component'

interface Props {
  label: string
  modelValue: string | number
  type?: 'text' | 'email' | 'password'
  id: string
  placeholder?: string
  required?: boolean
}

// Default props
const defaultProps = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: 'Insira seu texto aqui...',
  required: false,
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="flex flex-col mb-5 space-y-2">
    <label :for="id" class="text-sm text-foreground ml-1">
      {{ label }}
    </label>
    <div class="relative flex items-center">
      <input
        :type="defaultProps.type"
        :id="id"
        :placeholder="defaultProps.placeholder"
        :required="defaultProps.required"
        @input="updateValue"
        class="pl-12"
      />
      <div class="absolute w-4 h-4 -translate-y-1/2 top-1/2 left-5 opacity-50">
        <MailIcon v-if="type === 'email'" class="w-4 h-4" />
        <PasswordIcon v-if="type === 'password'" class="w-4 h-4" />
      </div>
    </div>
  </div>
</template>