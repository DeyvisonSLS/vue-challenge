<script setup lang="ts">
import { onMounted, ref } from 'vue'
import WelcomeModal from '@/components/WelcomeModal.vue'
import { useRoute } from 'vue-router'
import RefreshIcon from '@/assets/refresh-ccw.svg?component'
import Spinner from '@/assets/loader-circle.svg?component'

const route = useRoute()
const isModalOpen = ref(false)
const components = ref<any[]>([])
const error = ref<string | null>(null)
const isLoading = ref(true)
const lastUpdate = ref(0)

// Verificar se o usuário já visitou a página antes de mostrar o modal
onMounted(() => {
  if (route.query.popup === 'welcome') {
    const hasVisited = localStorage.getItem('hasVisited')
    if (!hasVisited) {
      isModalOpen.value = true
    }
  }
})

// Função de fetch no endpoint do github
const fetchStatus = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await fetch('https://www.githubstatus.com/api/v2/summary.json')
    if (!response.ok) {
      throw new Error('Erro ao buscar dados no servidor do github.')
    }

    const data = await response.json()
    components.value = data.components.filter((component: any) => component.showcase === true)
  } catch (err) {
    error.value = 'Erro ao buscar dados no servidor do github. Tente novamente mais tarde.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchStatus()
})

const interval = setInterval(() => {
  lastUpdate.value += 1
}, 60000) // Incrementa a cada minuto

const getFormatedLastUpdate = () => {
  if (lastUpdate.value < 60) {
    return `${lastUpdate.value} minutos atrás`
  } else {
    const hours = Math.floor(lastUpdate.value / 60)
    return `${hours} horas atrás`
  }
}

const closeModal = () => {
  isModalOpen.value = false
  localStorage.setItem('hasVisited', 'true')
}
</script>

<template>
  <main class="flex flex-col items-start justify-start w-full max-w-4xl min-h-screen p-12">
    <header>
      <!-- Header content -->
      <div class="flex flex-col mb-12">
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <p class="text-lg text-muted-foreground/50">Bem-vindo ao seu dashboard!</p>
      </div>

      <!-- Action buttons -->
      <div class="flex space-x-4 mb-8">
        <p class="text-sm text-muted-foreground/50">
          Última atualização: {{ getFormatedLastUpdate() }}
        </p>
        <button class="btn-outline p-3!">
          <RefreshIcon class="w-4 h-4" />
        </button>
      </div>
    </header>

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
        class="grid grid-cols-4 gap-4"
      >
        <div
          v-for="item in components"
          :key="item.id"
          class="col-span-1 p-4 bg-card rounded-lg shadow-md"
        >
          <h2 class="text-xl font-semibold mb-2">{{ item.name }}</h2>
          <p class="text-sm text-muted-foreground/50">
            {{ item.description || 'Sem descrição disponível.' }}
          </p>
        </div>
      </div>
    </div>

    <WelcomeModal
      v-if="isModalOpen"
      @close="closeModal"
      title="Bem-vindo!"
      description="Este é o seu dashboard. Aqui você pode acessar todas as funcionalidades do sistema e gerenciar suas atividades. Explore as opções disponíveis e aproveite ao máximo a sua experiência!"
    />
  </main>
</template>
