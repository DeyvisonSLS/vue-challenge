<script setup lang="ts">
import LoginIcon from '@/assets/log-in.svg?component'
import Input from '../components/Input.vue'
import AsteriskIcon from '@/assets/asterisk.svg?component'
import { computed, ref } from 'vue'
import router from '@/router'

const defaultCredentials = {
  email: 'teste@teste.com',
  password: '123456',
}

const email = ref('')
const password = ref('')

const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

const isPasswordValid = computed(() => {
  return password.value.length >= 6
})

const isFormValid = computed(() => {
  return isEmailValid.value && isPasswordValid.value
})

const handleLogin = () => {
  if (isFormValid.value) {
    if (
      email.value === defaultCredentials.email &&
      password.value === defaultCredentials.password
    ) {
      const hasVisited = localStorage.getItem('hasVisited')
      if (!hasVisited) {
        router.push({ path: '/dashboard', query: { popup: 'welcome' } })
      } else {
        router.push('/dashboard')
      }
    } else {
      alert('Credenciais inválidas. Tente novamente.')
    }
  } else {
    alert('Por favor, preencha todos os campos corretamente.')
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full max-w-sm min-h-screen p-4">
    <div class="flex flex-col w-full item-start">
      <!-- Title and description -->
      <div class="mb-4">
        <AsteriskIcon class="text-primary w-12 h-12 mb-2 stroke-2" />
        <h1 class="text-3xl font-bold mb-2">Faça Login</h1>
        <p class="text-sm text-muted-foreground/50 mb-4">Insira suas credenciais abaixo</p>
      </div>
      <!-- Login card -->
      <div class="flex flex-col text-foreground shadow-white/10">
        <!-- Login form -->
        <form @submit.prevent="handleLogin">
          <!-- Email input -->
          <Input
            v-model="email"
            type="email"
            id="email"
            label="E-mail"
            placeholder="Insira seu email..."
            required
          />
          <!-- Password input -->
          <Input
            v-model="password"
            type="password"
            id="password"
            label="Senha"
            placeholder="Digite sua senha..."
            required
          />

          <button
            type="submit"
            class="btn-primary w-full mt-2 font-medium"
          >
            Entrar
            <LoginIcon
              class="text-foreground ml-2 w-4 h-4"
            />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
