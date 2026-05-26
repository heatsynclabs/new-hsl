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

  // When closed, show the next thing on the calendar (any timed event, not just Open Hours)
  const now = new Date()
  const nextEvent = events.value.find(event =>
    !event.isAllDay && new Date(event.start) > now
  )

  if (nextEvent) {
    const nextOpen = new Date(nextEvent.start)
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
  gap: 8px;
  padding: 0;
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.08em;
  font-family: var(--font-ui);
  transition: color var(--transition-fast);
  text-transform: uppercase;
  border: 0;
  background: transparent;
}

.status-badge.status-badge--loading {
  color: var(--color-text-tertiary);
}

.status-dot {
  width: 9px;
  height: 9px;
  border: 2px solid var(--color-text-primary);
  transition: background-color var(--transition-base);
}

.status-dot--loading {
  background: var(--color-text-tertiary);
  border-color: var(--color-text-tertiary);
  animation: pulse 2s ease-in-out infinite;
}

.status-dot--open {
  background: var(--newbie-green);
  border-color: var(--newbie-green);
  animation: pulse 2s ease-in-out infinite;
}

.status-dot--closed {
  background: var(--red);
  border-color: var(--red);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.status-text {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
}

/* Open state - text colored, no box */
.status-badge.status-badge--open {
  color: var(--newbie-green);
}
:global([data-theme="dark"]) .status-badge.status-badge--open {
  color: #3fa37e;
}

.status-badge.status-badge--open .status-dot {
  background: var(--newbie-green);
}

/* Closed state - text colored, no box */
.status-badge.status-badge--closed {
  color: var(--red);
}
:global([data-theme="dark"]) .status-badge.status-badge--closed {
  color: #f0736a;
}
:global([data-theme="dark"]) .status-dot--closed { background: #f0736a; border-color: #f0736a; }

.status-badge.status-badge--closed .status-dot {
  background: var(--red);
}

/* Hover effect */
.status-badge:hover {
  cursor: default;
  opacity: 0.9;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .status-badge {
    font-size: var(--text-xs);
  }

  .status-dot {
    width: 8px;
    height: 8px;
  }

  .status-text {
    font-size: var(--text-xs);
  }
}
</style>