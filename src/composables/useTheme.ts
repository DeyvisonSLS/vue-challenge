import { onMounted, ref, watch, watchEffect } from 'vue'

const isDark = ref(false)

export function useTheme() {
  const updateDom = () => {
    if (typeof document !== undefined) {
      document.documentElement.classList.toggle('dark', isDark.value)
    }
  }

  watch(isDark, () => updateDom())

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  const initTheme = () => {
    try {
      if (typeof window === 'undefined') return
      const savedtheme = localStorage.getItem('theme')
      const choosedDark = window.matchMedia('(prefers-color-scheme: dark)').matches

      isDark.value = savedtheme === 'dark' || (!savedtheme && choosedDark)
    } catch (err) {
      console.error('Theme init error:', err)
    }
  }

  watchEffect(() => {
    updateDom()
  })

  return {
    isDark,
    toggleTheme,
    initTheme,
  }
}
