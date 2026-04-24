import { ref, onMounted, watch } from 'vue'

const isDark = ref(false)

export function useTheme() {
  const updateDom = () => {
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  watch(isDark, () => updateDom())

  const toggleTheme = () => {
    isDark.value = !isDark.value
    updateDom()
  }

  const initTheme = () => {
    const savedtheme = localStorage.getItem('theme')
    const choosedDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    isDark.value = savedtheme === 'dark' || (!savedtheme && choosedDark)
    updateDom()
  }

  return {
    isDark,
    toggleTheme,
    initTheme,
  }
}
