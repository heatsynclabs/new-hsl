<template>
  <button
    class="theme-toggle"
    @click="toggleTheme"
    :aria-label="ariaLabel"
    :title="ariaLabel"
  >
    <!-- Sun icon (shown in dark mode - click to go light) -->
    <svg
      v-if="currentTheme === 'dark'"
      class="theme-toggle__icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
    <!-- Moon icon (shown in light mode - click to go dark) -->
    <svg
      v-else
      class="theme-toggle__icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const currentTheme = ref<'light' | 'dark'>('light')
let mediaQuery: MediaQueryList | null = null

const ariaLabel = computed(() => {
  return currentTheme.value === 'dark'
    ? 'Switch to light mode'
    : 'Switch to dark mode'
})

const applyTheme = (theme: 'light' | 'dark') => {
  currentTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
}

const toggleTheme = () => {
  const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
  applyTheme(newTheme)
  localStorage.setItem('theme-preference', newTheme)
}

const handleSystemThemeChange = (e: MediaQueryListEvent) => {
  // Only apply system preference if user hasn't set a preference
  if (!localStorage.getItem('theme-preference')) {
    applyTheme(e.matches ? 'dark' : 'light')
  }
}

onMounted(() => {
  // Initialize theme from current document state (set by inline script)
  const currentDocTheme = document.documentElement.getAttribute('data-theme')
  if (currentDocTheme === 'dark' || currentDocTheme === 'light') {
    currentTheme.value = currentDocTheme
  }

  // Listen for system preference changes
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', handleSystemThemeChange)
})

onUnmounted(() => {
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }
})
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-1);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: color var(--transition-base), transform var(--transition-base);
}

.theme-toggle:hover {
  color: var(--color-accent-primary);
}

.theme-toggle:hover .theme-toggle__icon {
  transform: scale(1.1);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--color-accent-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.theme-toggle__icon {
  transition: transform var(--transition-base);
}
</style>
