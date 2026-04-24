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
    if (
      email.value !== defaultCredentials.email &&
      password.value !== defaultCredentials.password
    ) {
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
    class="text-foreground/4 bg-grid-pattern pointer-events-none absolute inset-0 rounded-4xl mask-t-from-50% opacity-30"
  ></div>

  <!-- Login content -->
  <div class="flex w-full flex-col items-center justify-center gap-2">
    <!-- Title and description -->
    <div class="my-4 flex flex-col items-center">
      <div
        class="to-primary border-primary mb-12 flex h-16 w-16 flex-col items-center justify-center bg-linear-to-bl from-purple-600"
      >
        <AsteriskIcon class="text-background mx-auto h-10 w-10" />
      </div>
      <h1 class="mb-2 text-center text-3xl font-bold">Faça Login</h1>
      <p class="text-muted-foreground/50 mb-4 text-center text-sm">
        Insira suas credenciais abaixo
      </p>
    </div>

    <!-- Login card -->
    <div
      class="from-border/80 to-border/30 z-50 flex w-full max-w-md flex-col items-center justify-center bg-linear-to-t p-px"
    >
      <div class="item-start bg-background flex w-full flex-col p-8">
        <!-- Login card -->
        <div
          class="text-foreground after: top-1/2 flex flex-col shadow-white/10 after:absolute after:inset-y-0 after:left-0"
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
              class="btn-primary mt-2 w-full font-medium"
            >
              Entrar
              <LoginIcon class="text-foreground ml-2 h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
