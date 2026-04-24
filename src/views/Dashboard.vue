<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import WelcomeModal from '@/components/WelcomeModal.vue'
import { useRoute, useRouter } from 'vue-router'
import RefreshIcon from '@/assets/icons/refresh-ccw.svg?component'
import LogoutIcon from '@/assets/icons/log-out.svg?component'
import Spinner from '@/assets/icons/loader-circle.svg?component'
import Tooltip from '@/components/Tooltip.vue'

const route = useRoute()
const router = useRouter()
const isModalOpen = ref(false)
const components = ref<any[]>([])
const occurrences = ref<any[]>([])
const error = ref<string | null>(null)
const isLoading = ref(true)
const lastUpdateTime = ref(0)
const maxUpdateTimeInMinutes = 1 // minutos
const maxSeconds = maxUpdateTimeInMinutes * 60 // segundos
const isAnimating = ref(false)

let timer: ReturnType<typeof setInterval>

// Função de fetch no endpoint do github
const fetchStatus = async () => {
  console.log('Fetching status...')
  isLoading.value = true
  error.value = null

  try {
    const response = await fetch('https://www.githubstatus.com/api/v2/summary.json')
    if (!response.ok) {
      throw new Error('Erro ao buscar dados no servidor do github.')
    }

    const data = await response.json()

    occurrences.value = data.occurrences
    components.value = data.components.filter((component: any) => component.showcase === true)

    lastUpdateTime.value = 0
  } catch (err) {
    error.value = 'Erro ao buscar dados no servidor do github. Tente novamente mais tarde.'
  } finally {
    isLoading.value = false
  }
}

const timerProgress = computed(() => {
  return `${(lastUpdateTime.value / maxSeconds) * 100}%`
})

const startTimer = () => {
  if (timer) clearInterval(timer)

  timer = setInterval(() => {
    lastUpdateTime.value++

    // Chama fetch a cada maxUpdateTimeInMinutes em minutos
    if (lastUpdateTime.value >= maxSeconds) {
      handleManualRefresh()
    }
  }, 1000) // Incrementa a cada segundo
}

const handleManualRefresh = async () => {
  await fetchStatus()

  // Marca animação como true
  isAnimating.value = true

  setTimeout(() => {
    isAnimating.value = false
    lastUpdateTime.value = 0
    startTimer()
  }, 1000) // Duração da animação
}

// Verificar se o usuário já visitou a página antes de mostrar o modal
onMounted(() => {
  handleManualRefresh()

  if (route.query.popup === 'welcome') {
    isModalOpen.value = true
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const getFormatedLastUpdate = () => {
  const seconds = lastUpdateTime.value
  if (seconds < 60) {
    return `menos de 1 minuto`
  } else {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} minutos atrás`
  }
}

const getTimeRemainingUntilUpdate = () => {
  const maxSeconds = maxUpdateTimeInMinutes * 60
  const remainingSeconds = maxSeconds - lastUpdateTime.value
  const minutesAndSeconds = formatTime(remainingSeconds)
  return minutesAndSeconds
}

const formatTime = (remainingSeconds: number) => {
  const minutes = Math.floor(remainingSeconds / 60)
  return `${minutes}:${String(remainingSeconds % 60).padStart(2, '0')}`
}

const closeModal = () => {
  isModalOpen.value = false
  localStorage.setItem('hasVisited', 'true')
}

const logout = () => {
  router.push('/login')
  localStorage.removeItem('user_token')
}
</script>

<template>
  <main class="flex flex-col items-start justify-start w-full max-w-7xl min-h-screen p-12">
    <header
      class="flex flex-row items-center justify-between w-full mb-8 border-b border-border/50"
    >
      <!-- Header content -->
      <div class="flex flex-col mb-12">
        <h1 class="text-2xl font-bold">Status Monitor</h1>
      </div>

      <!-- Action buttons -->
      <div class="flex space-x-4 mb-8">
        <p class="flex flex-row items-center text-sm text-muted-foreground/50">
          Última atualização há {{ getFormatedLastUpdate() }}
        </p>
        <!-- Refresh button -->
        <Tooltip
          position="bottom"
          :text="`Próxima atualização em ${getTimeRemainingUntilUpdate()}`"
        >
          <button
            class="relative btn-outline p-3!"
            @click="handleManualRefresh()"
          >
            <RefreshIcon
              class="w-4 h-4"
              :class="{ 'spin-after-countdown': isAnimating === true }"
            />
            <div
              class="absolute inset-0 bg-primary/20 transition-all duration-300 pointer-events-none"
              :style="{ insetBlockStart: timerProgress }"
            ></div>
          </button>
        </Tooltip>
        <!-- Logout button-->
        <Tooltip
          position="bottom"
          text="Sair"
        >
          <button
            class="relative btn-primary p-3!"
            @click="logout"
          >
            <LogoutIcon class="w-4 h-4" />
          </button>
        </Tooltip>
      </div>
    </header>

    <!-- Last occurrence -->
    <div class="flex flex-col w-full gap-4 mb-8">
      <div
        v-if="occurrences && occurrences.length > 0"
        class="w-full mb-8 p-4 bg-card rounded-lg shadow-md"
      >
        <h2 class="text-lg font-semibold mb-2">Última ocorrência</h2>
        <p class="text-sm text-muted-foreground/50">
          {{ occurrences[0].name }} - {{ occurrences[0].status }}
        </p>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex flex-col w-full gap-4 mb-8">
      <!-- Loading state -->
      <div
        v-if="isLoading"
        class="col-span-4 p-4 bg-card rounded-lg shadow-md"
      >
        <Spinner class="w-6 h-6 animate-spin" />
        <p class="text-sm text-muted-foreground/50">Carregando dados...</p>
      </div>

      <!-- Error state -->
      <div
        v-if="error"
        class="col-span-4 p-4 bg-card rounded-lg shadow-md"
      >
        <p class="text-sm text-red-500">{{ error }}</p>
      </div>

      <!-- Grid mapping -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <div
          v-for="item in components"
          :key="item.id"
          class="col-span-1 p-4 border-border border shadow-md"
        >
          <span
            class="statusBadge"
            :class="`bg-${item.status === 'ativo' ? 'status-operational' : 'status-degraded'}/20 text-${item.status === 'ativo' ? 'status-operational' : 'status-degraded'}`"
          >
            {{ item.status }}
          </span>
          <h2 class="text-xl font-semibold mb-2">{{ item.name }}</h2>
          <p class="text-sm text-muted-foreground/50">
            {{ item.description || 'Sem descrição disponível.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de boas-vindas -->
    <WelcomeModal
      v-if="isModalOpen"
      @close="closeModal"
      title="Bem-vindo!"
      description="Este é o seu dashboard. Aqui você pode acessar todas as funcionalidades do sistema e gerenciar suas atividades. Explore as opções disponíveis e aproveite ao máximo a sua experiência!"
    />
  </main>
</template>

<style scoped>
@import 'tailwindcss';
.statusBadge {
  @apply inline-flex items-center py-1 text-xs font-medium rounded-full;
}

@keyframes spin-refresh-animation {
  0% {
    opacity: 100%;
    rotate: 0deg;
  }
  25% {
    opacity: 10%;
  }
  50% {
    opacity: 100%;
  }
  75% {
    opacity: 10%;
  }
  100% {
    opacity: 100%;
    rotate: -360deg;
  }
}

.spin-after-countdown {
  animation: spin-refresh-animation ease-in-out infinite;
  animation-duration: 1s; /* Duração da animação igual ao tempo de atualização */
}
</style>
