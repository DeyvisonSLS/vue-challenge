<script setup lang="ts">
import FilterIcon from '@/assets/icons/funnel.svg?component'
import Tooltip from '@/components/Tooltip.vue'
import { onClickOutside } from '@vueuse/core'
import { computed, ref, Transition, watch, type Component } from 'vue'

interface DropdownOption {
  label: string
  icon?: Component
  action: () => void | Promise<void>
}

interface DropdownProps {
  label: string
  icon?: Component
  items: DropdownOption[]
}

const props = defineProps<DropdownProps>()

const handleItemClick = async (item: DropdownOption) => {
  await item.action()
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
        class="btn-outline"
        @click="handleToggleFilterDropdown()"
      >
        <component
          :is="props.icon"
          v-if="props.icon"
          class="h-4 w-4"
        />
        {{ label }}
      </button>
    </div>

    <!-- Filter panel -->
    <Transition name="dropdown-fade-slide">
      <div
        v-if="isDropdownOpen"
        class="bg-card absolute top-full right-0 z-10 w-80 translate-y-3 p-4 opacity-100 shadow-lg transition-all duration-300"
      >
        <!-- Buttons -->
        <Transition name="fade">
          <div class="flex flex-col gap-2">
            <button
              v-for="(item, index) in props.items"
              :key="index"
              @click="handleItemClick(item)"
              typeof="submit"
              class="hover:bg-muted/50 flex items-center gap-3 rounded-sm px-3 py-2 text-left text-sm transition-colors cursor-pointer"
            >
              <component
                :is="item?.icon"
                v-if="item.icon"
                class="h-4 w-4"
              />
              {{ item.label }}
            </button>
          </div>
        </Transition>
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
