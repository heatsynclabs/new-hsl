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
  gap: 9px;
  padding: 10px 16px;
  background: var(--tape-dark);
  border: 2px solid var(--on-dark-line);
  color: var(--on-dark);
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition: border-color var(--transition-fast);
}

.door-status--loading {
  border-color: var(--smoke);
}

.door-status--loading .door-status__indicator {
  background: var(--smoke);
  animation: pulse 2.4s ease-in-out infinite;
}

.door-status--open .door-status__indicator {
  background: var(--live);
  animation: pulse 2.4s ease-in-out infinite;
}

.door-status--closed .door-status__indicator {
  background: var(--fault);
}

.door-status__indicator {
  width: 11px;
  height: 11px;
  flex: none;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.35; }
}
</style>