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
      width="18"
      height="18"
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
      width="18"
      height="18"
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

onMounted(() => {
  // Initialize theme from current document state (set by the inline script).
  // We intentionally do NOT follow the OS preference: default is light, and
  // only the user's explicit toggle changes the theme.
  const currentDocTheme = document.documentElement.getAttribute('data-theme')
  if (currentDocTheme === 'dark' || currentDocTheme === 'light') {
    currentTheme.value = currentDocTheme
  }
})

onUnmounted(() => {})
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--ash);
  transition: color var(--transition-fast);
}

.theme-toggle:hover {
  color: var(--accent-text);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--hazard);
  outline-offset: 3px;
}

.theme-toggle__icon {
  display: block;
}
</style>
