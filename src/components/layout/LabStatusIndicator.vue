<template>
  <div class="lab-status" :class="{ 'lab-status--open': isOpen, 'lab-status--closed': !isOpen, 'lab-status--loading': isLoading }">
    <span class="lab-status__dot"></span>
    <span class="lab-status__text">{{ displayText }}</span>
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

const displayText = computed(() => {
  if (isLoading.value) return 'Checking...'
  if (isOpen.value) return 'Open'

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
    return `Closed • ${day} ${time}`
  }

  return 'Closed'
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
.lab-status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  background: var(--off-white);
  border: 1px solid var(--warm-gray);
  transition: all var(--transition-base);
  white-space: nowrap;
  font-size: var(--text-xs);
}

.lab-status__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.lab-status--open .lab-status__dot {
  background: var(--success-green);
  animation: pulse 2s infinite;
}

.lab-status--closed .lab-status__dot {
  background: var(--warm-gray);
}

.lab-status--loading .lab-status__dot {
  background: var(--warm-gray);
  animation: pulse 1s infinite;
}

.lab-status__text {
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}

.lab-status--open .lab-status__text {
  color: var(--success-green);
}

.lab-status--closed .lab-status__text {
  color: var(--graphite);
}

.lab-status--loading .lab-status__text {
  color: var(--warm-gray);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

/* Mobile adjustments */
@media (max-width: 480px) {
  .lab-status {
    display: none; /* Hide on mobile to save space */
  }
}
</style>