<template>
  <div class="status-badge" :class="{ 'status-badge--loading': isLoading, 'status-badge--open': isOpen && !isLoading, 'status-badge--closed': !isOpen && !isLoading }">
    <span class="status-dot" :class="statusClass"></span>
    <span class="status-text">{{ displayText }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { heatSyncCalendar } from '../../services/calendarService'
import { format } from 'date-fns'

const isOpen = ref(false)
const isLoading = ref(true)
const events = ref<any[]>([])
let statusIntervalId: number | undefined
let eventIntervalId: number | undefined

const statusClass = computed(() => {
  if (isLoading.value) return 'status-dot--loading'
  if (isOpen.value) return 'status-dot--open'
  return 'status-dot--closed'
})

const displayText = computed(() => {
  if (isLoading.value) return 'Checking...'
  if (isOpen.value) return 'OPEN'

  // When closed, show next opening time if available
  const now = new Date()
  const upcomingOpenHours = events.value
    .filter(event => {
      const eventStart = new Date(event.start)
      const eventTitle = event.title.toLowerCase()
      return eventStart > now && eventTitle.includes('open hours')
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  if (upcomingOpenHours.length > 0) {
    const nextOpen = new Date(upcomingOpenHours[0].start)
    const day = format(nextOpen, 'EEE')
    const time = format(nextOpen, 'ha').toLowerCase()
    return `Closed • Opens ${day} ${time}`
  }

  return 'CLOSED'
})

const checkDoorStatus = async () => {
  try {
    isLoading.value = true
    const response = await fetch('https://members.heatsynclabs.org/space_api.json')
    const data = await response.json()
    isOpen.value = data.open === true
  } catch (error) {
    console.error('Failed to fetch door status:', error)
    // Fallback to checking calendar events
    checkCalendarStatus()
  } finally {
    isLoading.value = false
  }
}

const checkCalendarStatus = () => {
  const now = new Date()
  const openEvent = events.value.find(event => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)
    const eventTitle = event.title.toLowerCase()

    if (eventTitle.includes('open hours')) {
      return now >= eventStart && now <= eventEnd
    }
    return false
  })

  isOpen.value = !!openEvent
}

const fetchEvents = async () => {
  try {
    const allEvents = await heatSyncCalendar.getAllEvents(7) // Get next week
    events.value = allEvents
  } catch (error) {
    console.error('Failed to fetch events for lab status:', error)
  }
}

onMounted(() => {
  // Initial load
  checkDoorStatus()
  fetchEvents()

  // Check door status every 2 minutes
  statusIntervalId = window.setInterval(checkDoorStatus, 2 * 60 * 1000)

  // Refresh events every 30 minutes
  eventIntervalId = window.setInterval(fetchEvents, 30 * 60 * 1000)

  // Add console command for testing
  ;(window as any).toggleDoorStatus = () => {
    isOpen.value = !isOpen.value
    isLoading.value = false
    console.log(`Door status toggled to: ${isOpen.value ? 'OPEN' : 'CLOSED'}`)
    return isOpen.value ? 'OPEN' : 'CLOSED'
  }

  // Add console command to set specific status
  ;(window as any).setDoorStatus = (status: boolean) => {
    isOpen.value = status
    isLoading.value = false
    console.log(`Door status set to: ${isOpen.value ? 'OPEN' : 'CLOSED'}`)
    return isOpen.value ? 'OPEN' : 'CLOSED'
  }

  console.log('%c🛠️ Debug Commands Available:', 'color: #d35f35; font-weight: bold; font-size: 14px')
  console.log('%ctoggleDoorStatus() - Toggle between open/closed', 'color: #7a8b7f')
  console.log('%csetDoorStatus(true/false) - Set specific status', 'color: #7a8b7f')
})

onUnmounted(() => {
  if (statusIntervalId) window.clearInterval(statusIntervalId)
  if (eventIntervalId) window.clearInterval(eventIntervalId)
})
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-family: var(--font-mono);
  transition: all var(--transition-fast);
  text-transform: uppercase;
}

.status-badge.status-badge--loading {
  border: 1px solid var(--color-text-tertiary);
  color: var(--color-text-tertiary);
  background: transparent;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transition: background-color var(--transition-base);
}

.status-dot--loading {
  background: var(--color-text-tertiary);
  animation: pulse 2s ease-in-out infinite;
}

.status-dot--open {
  background: #86efac;
  animation: pulse 2s ease-in-out infinite;
}

.status-dot--closed {
  background: #ef4444;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 8px rgba(134, 239, 172, 0.5), 0 0 16px rgba(134, 239, 172, 0.3);
  }
  50% {
    box-shadow: 0 0 14px rgba(134, 239, 172, 0.7), 0 0 28px rgba(134, 239, 172, 0.5);
  }
}

.status-text {
  font-family: var(--font-mono);
  font-size: 11px;
}

/* Open state - text with green outline and glow */
.status-badge.status-badge--open {
  background-color: transparent;
  color: var(--color-text-primary);
  border: 1.5px solid #86efac;
  animation: glow 2s ease-in-out infinite;
}

.status-badge.status-badge--open .status-dot {
  background: #86efac;
}

/* Closed state - text with red outline */
.status-badge.status-badge--closed {
  background-color: transparent;
  color: var(--color-text-primary);
  border: 1.5px solid #ef4444;
  box-shadow: 0 1px 3px var(--color-shadow);
}

.status-badge.status-badge--closed .status-dot {
  background: #ef4444;
}

/* Hover effect */
.status-badge:hover {
  cursor: default;
  opacity: 0.9;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .status-badge {
    font-size: 10px;
    padding: 3px 8px;
  }

  .status-dot {
    width: 5px;
    height: 5px;
  }

  .status-text {
    font-size: 10px;
  }
}
</style>