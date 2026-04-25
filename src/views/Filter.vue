<script setup lang="ts">
import FilterIcon from '@/assets/icons/funnel.svg?component'
import Tooltip from '@/components/Tooltip.vue'
import { onClickOutside } from '@vueuse/core'
import { ref, Transition } from 'vue'
import Select from '@/components/Select.vue'

type StatusType = 'operational' | 'degraded' | 'outage' | ''

export interface FilterData {
  status: StatusType
}

// Recebe estado atual
const props = defineProps<{ initialFilters: FilterData }>()

// Envia estado atualizado
const emit = defineEmits<{ (e: 'apply', payload: FilterData): void }>()

// Estado local dos filtros
const localFilters = ref<FilterData>({ ...props.initialFilters })

const handleApplyFilter = () => {
  emit('apply', localFilters.value)
}
const handleClearFilter = () => {
  localFilters.value.status = ''
  emit('apply', localFilters.value)
}

// Estados do dropdown
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const handleToggleFilterDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

onClickOutside(dropdownRef, () => {
  isDropdownOpen.value = false
})
</script>

<template>
  <!-- Botão de filtro -->
  <Tooltip
    ref="dropdownRef"
    position="bottom"
    text="Aplicar Filtros"
    :isActive="!isDropdownOpen"
  >
    <div class="relative size-fit">
      <button
        class="btn-primary"
        @click="handleToggleFilterDropdown()"
      >
        <FilterIcon class="h-4 w-4" />
        Filtros
      </button>
      <!-- Bullet mockado -->
      <div
        v-if="localFilters.status"
        class="text-background absolute -top-2 -right-2 h-4 w-4 rounded-full bg-white text-center text-xs"
      >
        1
      </div>
    </div>

    <!-- Filter panel -->
    <Transition name="dropdown-fade-slide">
      <div
        v-if="isDropdownOpen"
        class="bg-card absolute top-full right-0 z-10 w-80 translate-y-3 p-4 opacity-100 shadow-lg transition-all duration-300"
      >
        <Select
          id="status-filter"
          v-model="localFilters.status"
          label="Status"
          placeholder="Selecione um status"
          :optionsList="['operational', 'degraded', 'outage']"
        />
        <div class="flex flex-col gap-2">
          <Transition name="fade">
            <button
              @click="handleApplyFilter"
              typeof="submit"
              class="btn-primary w-full"
              :disabled="!localFilters.status"
            >
              Aplicar Filtros
            </button>
          </Transition>
          <button
            v-if="localFilters.status"
            @click="handleClearFilter"
            typeof="submit"
            class="btn-secondary w-full"
            :disabled="!localFilters.status"
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    </Transition>
  </Tooltip>
</template>

<style scoped>
.dropdown-fade-slide-enter-active,
.dropdown-fade-slide-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.dropdown-fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Entrada: Suave e com "mola" */
.fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Saída: Mais rápida para não frustrar o usuário */
.fade-leave-active {
  transition: all 0.2s ease-in;
}
</style>
