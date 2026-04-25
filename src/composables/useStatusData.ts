import { computed, ref } from 'vue'

import { githubService } from '@/services/githubService'
import type { GitHubComponent } from '@/types/github'

export function useStatusData() {
  const rawComponents = ref<GitHubComponent[]>([])
  const incidents = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchData = async () => {
    isLoading.value = true

    try {
      const data = await githubService.getSummary()
      rawComponents.value = data.components
      incidents.value = data.incidents
    } catch (err) {
      error.value = 'Erro ao carregar dados'
    } finally {
      isLoading.value = false
    }
  }

  const visibleComponents = computed(() => {
    return rawComponents.value.filter((component) => component.showcase)
  })

  return {
    rawComponents,
    incidents,
    visibleComponents,
    isLoading,
    error,
    fetchData,
  }
}
