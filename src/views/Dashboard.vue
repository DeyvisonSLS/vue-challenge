<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import WelcomeModal from '@/components/WelcomeModal.vue'
import { useRoute, useRouter } from 'vue-router'
import RefreshIcon from '@/assets/icons/refresh-ccw.svg?component'
import LogoutIcon from '@/assets/icons/log-out.svg?component'
import RabbitIcon from '@/assets/icons/rabbit.svg?component'
import SunMoonIcon from '@/assets/icons/sun-moon.svg?component'
import BracesIcon from '@/assets/icons/braces.svg?component'
import SlidersHorizontalIcon from '@/assets/icons/sliders-horizontal.svg?component'
import Tooltip from '@/components/Tooltip.vue'
import Filter from './Filter.vue'
import type { FilterData } from './Filter.vue'
import { CATEGORY_MAP as categories } from '@/constants/status'
import { useStatusData } from '@/composables/useStatusData'
import { useTheme } from '@/composables/useTheme'
import Dropdown from './Dropdown.vue'

const { rawComponents, incidents, visibleComponents, isLoading, error, fetchData } = useStatusData()

const theme = useTheme()
const route = useRoute()
const router = useRouter()
const isModalOpen = ref(false)
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
  category: '',
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

const filteredComponents = computed(() => {
  return visibleComponents.value.filter((component) => {
    return Object.entries(filters.value).every(([key, value]) => {
      if (!value) return true

      // Verificação especial no caso do category, como o objeto do github não tem category, na verdade vamos ver se no mapping existe um registro com o nome do component e vamos pegar a sua categoria
      if (key === 'category') {
        const componentCategory = categories[component.name]
        // Sabendo a categoria do componente da lista, podemos comparar com o value que veio do filtro aplicado, por exemplo, {category: Collaboration}
        return componentCategory === value
      }
      return component[key as keyof typeof component] === value
    })
  })
})

const handleManualRefresh = async () => {
  await fetchData()

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

// Estado que controla o mockmode
const isMockMode = ref(false)
const toggleMock = () => {
  isMockMode.value = !isMockMode.value
}

// Último incidente (toggle)
const lastIncident = computed(() => {
  if (isMockMode.value) return mockIncident

  if (!incidents.value || incidents.value.length === 0) return null
  return incidents.value[0]
})
// Mock de último incidente
const mockIncident = {
  name: 'Unplanned Database Outage',
  status: 'identified',
  impact: 'critical',
  created_at: '2026-04-25T14:22:39Z',
  incident_updates: [
    {
      body: 'Nossos servidores de banco de dados estão apresentando instabilidade crítica. A equipe de infraestrutura já foi acionada e está trabalhando na restauração dos serviços.',
      status: 'identified',
      created_at: '2026-04-25T14:25:40Z',
    },
  ],
}

const userMenuItems = [
  {
    label: 'Trocar Tema',
    icon: SunMoonIcon,
    action: () => theme.toggleTheme(),
  },
  {
    label: 'Ativar Mock Data',
    icon: BracesIcon,
    action: () => toggleMock(),
  },
]

const mobileMenuItems = [
  {
    label: 'Trocar Tema',
    icon: SunMoonIcon,
    action: () => theme.toggleTheme(),
  },
  {
    label: 'Ativar Mock Data',
    icon: BracesIcon,
    action: () => toggleMock(),
  },
  {
    label: 'Atualizar',
    icon: RefreshIcon,
    action: () => handleManualRefresh(),
  },
  {
    label: 'Logout',
    icon: LogoutIcon,
    action: () => logout(),
  }
]


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

const handleApplyFilters = async (newFilters: FilterData) => {
  // Preparado para receber outros filtros
  filters.value = { ...newFilters }
  console.log('Filters updated' + filters.value.status)

  await handleManualRefresh()
}

const handleClearFilter = async () => {
  filters.value = {
    status: '',
    category: '',
  }
  await handleManualRefresh()
}

const statusClasses: Record<string, string> = {
  operational: 'bg-status-operational/5 text-status-operational',
  degraded: 'bg-status-degraded/5 text-status-degraded',
  outage: 'bg-status-outage/5 text-status-outage',
}
</script>

<template>
  <main class="flex min-h-screen w-full max-w-7xl flex-col items-start justify-start p-12">
    <!-- Header Desktop -->
    <header class="mb-2 hidden w-full flex-row items-center justify-between md:flex">
      <!-- Header content -->
      <div class="mb-12 flex flex-col">
        <h1 class="text-2xl font-bold">Status Monitor</h1>
      </div>

      <!-- Action buttons -->
      <div class="mb-8 flex flex-row items-center justify-center space-x-4">
        <p class="text-muted-foreground/50 flex flex-row items-center text-sm">
          Última atualização há {{ getFormatedLastUpdate() }}
        </p>
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
              class="bg-border/20 pointer-events-none absolute inset-0 transition-all duration-300"
              :style="{ insetBlockStart: timerProgress }"
            ></div>
          </button>
        </Tooltip>

        <!-- Settings button dropdown -->
        <Dropdown
          label="Options"
          :icon="SlidersHorizontalIcon"
          :items="userMenuItems"
        />

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

    <!-- Header mobile -->
    <header class="mb-2 flex w-full flex-row items-center justify-between md:hidden">
      <!-- Header content -->
      <div class="mb-12 flex flex-col">
        <h1 class="text-2xl font-bold">Status Monitor</h1>
      </div>

      <!-- Action buttons -->
      <div class="mb-8 flex flex-row items-center justify-center space-x-4">
        <Dropdown label="Menu" :icon="SlidersHorizontalIcon" :items="mobileMenuItems" />
      </div>
    </header>

    <!-- Last occurrence -->
    <div class="mb-2 flex w-full flex-col gap-4">
      <div class="bg-background border-border/50 mb-8 w-full border-y border-dotted py-8">
        <h2 class="text-md font-semibold">Incidentes ({{ lastIncident ? 1 : 0 }})</h2>
        <p
          v-if="lastIncident && lastIncident.length === 0"
          class="text-muted-foreground text-sm"
        >
          Nenhum incidente registrado recentemente
        </p>
        <div
          v-if="lastIncident"
          class=""
        >
          <p class="text-muted-foreground/50 text-sm">
            {{ lastIncident?.name }} - {{ lastIncident?.status }}
          </p>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="mb-8 flex w-full flex-col gap-4">
      <!-- Grid title e filtros -->
      <div class="flex w-full flex-row items-center justify-between">
        <span class="text-md text-foreground"
          >Mostrando {{ filteredComponents.length }} serviços:</span
        >
        <Filter
          :initial-filters="filters"
          @apply="handleApplyFilters"
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
        v-else-if="error"
        class="bg-card col-span-4 rounded-lg p-4 shadow-md"
      >
        <p class="text-sm text-red-500">{{ error }}</p>
      </div>

      <!-- Grid mapping -->
      <!-- Força re-renderização ao atualizar dados -->
      <div
        v-else-if="!isLoading && !error && filteredComponents?.length > 0"
        class="flex w-full flex-col gap-4"
      >
        <div
          :key="String(isGridAnimating)"
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          <div
            v-for="(item, index) in filteredComponents"
            :key="item.id"
            class="card-entrance-animation border-border/30 col-span-1 border p-4 shadow-md"
            :style="{ animationDelay: 10 + index * 100 + 'ms' }"
          >
            <span
              class="statusBadge"
              :class="statusClasses[item.status]"
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

      <!-- Empty state -->
      <div
        v-else-if="!isLoading && !error && filteredComponents.length === 0"
        class="flex w-full flex-col gap-4"
      >
        <div class="flex h-100 w-full flex-col items-center justify-center gap-6 text-center">
          <div class="flex flex-col items-center justify-center">
            <div class="border-border/30 border p-4">
              <p class="text-muted-foreground text-md w-40">Não encontramos nada por aqui...</p>
            </div>
            <div
              class="h-0 w-0 border-t-6 border-r-12 border-l-12 border-t-white/30 border-r-transparent border-l-transparent"
            ></div>
          </div>
          <div class="relative flex flex-col items-center justify-center -space-y-1">
            <RabbitIcon class="text-muted-foreground z-100 h-8 w-8 stroke-1" />
            <div class="bg-muted/70 h-px w-50" />
            <!-- Grama -->
            <div
              v-for="i in 10"
              :key="i"
              class="absolute h-0 w-0 border-x-12 border-b-[6px] border-x-transparent border-b-white/20"
              :style="{ top: '100%', left: `${8 * i + 40}px`, transform: 'translateY(-50%)' }"
            >
              <div
                class="bg-background absolute top-1/2 left-1/2 h-2.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              ></div>
            </div>
            <!-- Plataforma -->
            <div class="bg-muted absolute top-full left-0 h-4 w-px translate-y-1"></div>
            <div class="bg-muted absolute top-full right-0 h-4 w-px translate-y-1"></div>
          </div>
        </div>
        <!-- Limpar filtros -->
        <button
          v-if="filters"
          @click="handleClearFilter"
          typeof="submit"
          class="btn-outline border-border/30 mx-auto w-full max-w-sm!"
        >
          Limpar Filtros
        </button>
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
    opacity: 0.3;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
