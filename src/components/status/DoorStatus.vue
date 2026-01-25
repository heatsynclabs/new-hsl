<template>
  <div class="door-status" :class="{ 'door-status--open': isOpen, 'door-status--closed': !isOpen, 'door-status--loading': isLoading }">
    <div class="door-status__indicator"></div>
    <span class="door-status__text">
      {{ isLoading ? 'Checking...' : (isOpen ? 'Lab Open' : 'Lab Closed') }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isOpen = ref(false)
const isLoading = ref(true)

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
  setInterval(checkDoorStatus, 5 * 60 * 1000)
})
</script>

<style scoped>
.door-status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
  letter-spacing: var(--tracking-wide);
  transition: all var(--transition-base);
}

.door-status--loading {
  background: var(--warm-gray);
  color: var(--graphite);
}

.door-status--open {
  background: var(--accent-sage);
  color: var(--paper-white);
}

.door-status--closed {
  background: var(--graphite);
  color: var(--paper-white);
}

.door-status__indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
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