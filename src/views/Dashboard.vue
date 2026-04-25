<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import WelcomeModal from '@/components/WelcomeModal.vue'
import { useRoute, useRouter } from 'vue-router'
import RefreshIcon from '@/assets/icons/refresh-ccw.svg?component'
import LogoutIcon from '@/assets/icons/log-out.svg?component'
import Spinner from '@/assets/icons/loader-circle.svg?component'
import Tooltip from '@/components/Tooltip.vue'
import Filter from './Filter.vue'
import type { FilterData } from './Filter.vue'

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
const isGridAnimating = ref(false)

const formatTime = (remainingSeconds: number) => {
  const minutes = Math.floor(remainingSeconds / 60)
  return `${minutes}:${String(remainingSeconds % 60).padStart(2, '0')}`
}

let timer: ReturnType<typeof setInterval>

const filters = ref<FilterData>({
  status: '',
})

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

// Função de fetch no endpoint do github
const fetchStatus = async () => {
  console.log('Fetching status...')
  isLoading.value = true
  error.value = null

  try {
    const [response] = await Promise.all([
      fetch('https://www.githubstatus.com/api/v2/summary.json'),
      new Promise((resolve) => setTimeout(resolve, 600)),
    ])
    if (!response.ok) {
      throw new Error('Erro ao buscar dados no servidor do github.')
    }

    const data = await response.json()

    // Filtra apenas os com showcase = true
    const visibleComponents = data.components.filter(
      (component: any) => component.showcase === true
    )

    // Aplica ou não os filtros, dependendo se há filtro selecionado
    const filteredComponents = filters.value.status
      ? visibleComponents.filter((component: any) => component.status === filters.value.status)
      : visibleComponents

    components.value = filteredComponents
    occurrences.value = data.occurrences

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

  // Dispara stagger animation do grid de cards
  isGridAnimating.value = !isGridAnimating.value

  // Marca animação como true
  isAnimating.value = true

  setTimeout(() => {
    isAnimating.value = false
    lastUpdateTime.value = 0
    startTimer()
  }, 1000) // Duração da animação
}

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

const handleCloseModal = () => {
  isModalOpen.value = false
  localStorage.setItem('hasVisited', 'true')
  router.push(route.path) // Remove query da URL sem recarregar a página
}

const logout = () => {
  router.push('/login')
  localStorage.removeItem('user_token')
}

const handleApplyFilter = async (newFilters: FilterData) => {
  // Preparado para receber outros filtros
  filters.value = { ...newFilters }
  console.log('Filters updated' + filters.value.status)

  await handleManualRefresh()
}
</script>

<template>
  <main class="flex min-h-screen w-full max-w-7xl flex-col items-start justify-start p-12">
    <header
      class="border-border/30 mb-8 flex w-full flex-row items-center justify-between border-b"
    >
      <!-- Header content -->
      <div class="mb-12 flex flex-col">
        <h1 class="text-2xl font-bold">Status Monitor</h1>
      </div>

      <!-- Action buttons -->
      <div class="mb-8 flex flex-row items-center justify-center space-x-4">
        <p class="text-muted-foreground/50 flex flex-row items-center text-sm">
          Última atualização há {{ getFormatedLastUpdate() }}
        </p>
        <!-- Refresh button -->
        <Tooltip
          position="bottom"
          :text="`Próxima atualização em ${getTimeRemainingUntilUpdate()}`"
        >
          <button
            class="btn-outline relative p-3!"
            @click="handleManualRefresh()"
          >
            <RefreshIcon
              class="h-4 w-4"
              :class="{ 'spin-after-countdown': isAnimating === true }"
            />
            <div
              class="bg-primary/20 pointer-events-none absolute inset-0 transition-all duration-300"
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
            class="btn-destructive relative gap-2 p-3! leading-none"
            @click="logout"
          >
            Sair
            <LogoutIcon class="h-4 w-4" />
          </button>
        </Tooltip>
      </div>
    </header>

    <!-- Last occurrence -->
    <div class="mb-8 flex w-full flex-col gap-4">
      <div
        v-if="occurrences && occurrences.length > 0"
        class="bg-card mb-8 w-full rounded-lg p-4 shadow-md"
      >
        <h2 class="mb-2 text-lg font-semibold">Última ocorrência</h2>
        <p class="text-muted-foreground/50 text-sm">
          {{ occurrences[0].name }} - {{ occurrences[0].status }}
        </p>
      </div>
    </div>

    <!-- Main content -->
    <div class="mb-8 flex w-full flex-col gap-4">
      <!-- Grid title e filtros -->
      <div class="flex w-full flex-row items-center justify-between">
        <span class="text-md text-foreground">Mostrando {{ components.length }} serviços:</span>
        <Filter
          :initial-filters="filters"
          @apply="handleApplyFilter"
        />
      </div>
      <!-- Loading state -->
      <div
        v-if="isLoading"
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        <div
          v-for="i in 4"
          :key="i"
          class="bg-muted/20 h-32 w-full animate-pulse"
        ></div>
        <div
          v-for="i in 4"
          :key="i"
          class="bg-muted/20 h-32 w-full animate-pulse"
        ></div>
      </div>

      <!-- Error state -->
      <div
        v-if="error"
        class="bg-card col-span-4 rounded-lg p-4 shadow-md"
      >
        <p class="text-sm text-red-500">{{ error }}</p>
      </div>

      <!-- Grid mapping -->
      <!-- Força re-renderização ao atualizar dados -->
      <div
        v-else-if="!isLoading && !error"
        class="flex w-full flex-col gap-4"
      >
        <div
          :key="String(isGridAnimating)"
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          <div
            v-for="(item, index) in components"
            :key="item.id"
            class="card-entrance-animation border-border/30 col-span-1 border p-4 shadow-md"
            :style="{ animationDelay: 50 + index * 100 + 'ms' }"
          >
            <span
              class="statusBadge"
              :class="`bg-${item.status === 'ativo' ? 'status-operational' : 'status-degraded'}/20 text-${item.status === 'ativo' ? 'status-operational' : 'status-degraded'}`"
            >
              {{ item.status }}
            </span>
            <h2 class="mb-2 text-xl font-semibold">{{ item.name }}</h2>
            <p class="text-muted-foreground/50 text-sm">
              {{ item.description || 'Sem descrição disponível.' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de boas-vindas -->
    <WelcomeModal
      v-if="isModalOpen"
      @close="handleCloseModal"
      title="Bem-vindo!"
      description="Bem-vindo ao Status Monitor! Este painel exibe o status atual dos serviços do GitHub. Você pode ver as últimas ocorrências, o status de cada componente e receber atualizações em tempo real. Fique à vontade para explorar e verificar o status dos serviços do GitHub!"
    />
  </main>
</template>

<style scoped>
@import 'tailwindcss';

@keyframes fade-in-slide {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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

.card-entrance-animation {
  opacity: 0;
  will-change: transform, opacity;
  animation: fade-in-slide 0.9s ease forwards;
}
</style>
