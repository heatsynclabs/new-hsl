<template>
  <div class="door-status" :class="{ 'door-status--open': isOpen, 'door-status--closed': !isOpen, 'door-status--loading': isLoading }">
    <div class="door-status__indicator"></div>
    <span class="door-status__text">
      {{ isLoading ? 'Checking...' : (isOpen ? 'Lab Open' : 'Lab Closed') }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isOpen = ref(false)
const isLoading = ref(true)
let intervalId: number | undefined

const checkDoorStatus = async () => {
  try {
    isLoading.value = true
    const response = await fetch('https://members.heatsynclabs.org/space_api.json')
    const data = await response.json()
    isOpen.value = data.open === true
  } catch (error) {
    console.error('Failed to fetch door status:', error)
    isOpen.value = false
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  checkDoorStatus()

  // Check status every 5 minutes
  intervalId = window.setInterval(checkDoorStatus, 5 * 60 * 1000)
})

onUnmounted(() => {
  if (intervalId) window.clearInterval(intervalId)
})
</script>

<style scoped>
.door-status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: 2px solid var(--ink);
  font-size: var(--text-lg);
  font-family: var(--font-ui);
  font-weight: 400;
  letter-spacing: var(--tracking-wide);
  transition: all var(--transition-base);
}

.door-status--loading {
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
}

.door-status--open {
  background: var(--newbie-green);
  color: var(--paper);
}

.door-status--closed {
  background: var(--ink);
  color: var(--paper);
}

.door-status__indicator {
  width: 9px;
  height: 9px;
  background: currentColor;
}

.door-status--loading .door-status__indicator {
  animation: pulse 2s ease-in-out infinite;
}

.door-status__text {
  text-transform: uppercase;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>