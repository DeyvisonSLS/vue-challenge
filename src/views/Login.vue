<script setup lang="ts">
import LoginIcon from '@/assets/icons/log-in.svg?component'
import Input from '../components/Input.vue'
import AsteriskIcon from '@/assets/icons/asterisk.svg?component'
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
  if (!isFormValid.value) {
    alert('Por favor, preencha todos os campos corretamente.')
  }
  if (email.value !== defaultCredentials.email && password.value !== defaultCredentials.password) {
    alert('Credenciais inválidas. Tente novamente.')
  }

  // Armazenamento de token fake para simular autenticação (no cenário real aqui seria o token retornado pela API)
  const fakeSessionToken = 'fake-jwt-token'
  localStorage.setItem('user_token', fakeSessionToken)

  const hasVisited = localStorage.getItem('hasVisited')

  if (!hasVisited) {
    router.push({ path: '/dashboard', query: { popup: 'welcome' } })
  } else {
    router.push('/dashboard')
  }
}
</script>

<template>
  <!-- Grid pattern -->
  <div
    class="absolute text-foreground/4 mask-t-from-50% inset-0 bg-grid-pattern opacity-30 pointer-events-none rounded-4xl"
  ></div>

  <!-- Login content -->
  <div class="flex flex-col w-full items-center justify-center gap-2">
    <!-- Title and description -->
    <div class="my-4">
      <h1 class="text-3xl font-bold mb-2 text-center">Faça Login</h1>
      <p class="text-sm text-muted-foreground/50 mb-4 text-center">
        Insira suas credenciais abaixo
      </p>
    </div>

    <!-- Login card -->
    <div
      class="flex flex-col items-center justify-center w-full max-w-md p-px bg-linear-to-t from-border/80 to-border/30 z-50"
    >
      <div class="flex flex-col w-full item-start bg-background p-8">
        <!-- Login card -->
        <div
          class="flex flex-col text-foreground shadow-white/10 after:absolute after:inset-y-0 after:left-0 after: top-1/2"
        >
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
              <LoginIcon class="text-foreground ml-2 w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
