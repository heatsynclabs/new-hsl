<template>
  <BaseCard padding="lg" class="schedule">
    <div class="schedule__header">
      <h2 class="schedule__title">Open Hours</h2>
      <DoorStatus />
    </div>

    <div v-if="loading" class="schedule__loading">
      <p>Loading hours...</p>
    </div>

    <div v-else class="schedule__grid">
      <div
        v-for="day in weeklySchedule"
        :key="day.name"
        :class="['schedule__day', { 'schedule__day--open': day.isOpen }]"
      >
        <div class="schedule__day-name">{{ day.name }}</div>
        <div class="schedule__day-hours">{{ day.hours }}</div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import BaseCard from '../base/BaseCard.vue'
import DoorStatus from '../status/DoorStatus.vue'
import { CalendarService, type CalendarEvent } from '../../services/calendarService'

interface ScheduleDay {
  name: string
  hours: string
  isOpen: boolean
  dayOfWeek: number
}

const loading = ref(true)
const openHoursEvents = ref<CalendarEvent[]>([])
const calendarService = new CalendarService()

// Force reactive updates
const scheduleVersion = ref(0)

// Default schedule as fallback - all days show Members 24/7 when no Open Hours events found
const defaultSchedule: ScheduleDay[] = [
  { name: 'SUNDAY', hours: 'Members 24/7', isOpen: false, dayOfWeek: 0 },
  { name: 'MONDAY', hours: 'Members 24/7', isOpen: false, dayOfWeek: 1 },
  { name: 'TUESDAY', hours: 'Members 24/7', isOpen: false, dayOfWeek: 2 },
  { name: 'WEDNESDAY', hours: 'Members 24/7', isOpen: false, dayOfWeek: 3 },
  { name: 'THURSDAY', hours: 'Members 24/7', isOpen: false, dayOfWeek: 4 },
  { name: 'FRIDAY', hours: 'Members 24/7', isOpen: false, dayOfWeek: 5 },
  { name: 'SATURDAY', hours: 'Members 24/7', isOpen: false, dayOfWeek: 6 },
]

const weeklySchedule = computed(() => {
  // Include scheduleVersion in dependency to force updates
  scheduleVersion.value

  if (openHoursEvents.value.length === 0) {
    return defaultSchedule
  }

  // Create a schedule based on calendar events
  const schedule: ScheduleDay[] = []
  const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
    const dayName = dayNames[dayOfWeek]

    // Find open hours events for this day of week from next 7 days
    const dayEvents = openHoursEvents.value.filter(event => {
      return event.start.getDay() === dayOfWeek
    })

    if (dayEvents.length > 0) {
      // Use the first event found for this day
      const event = dayEvents[0]!
      const startTime = format(event.start, 'h:mm a')
      const endTime = format(event.end, 'h:mm a')

      schedule.push({
        name: dayName!,
        hours: event.isAllDay ? 'All Day' : `${startTime} - ${endTime}`,
        isOpen: true,
        dayOfWeek: dayOfWeek
      })
    } else {
      // Use default for this day
      const defaultDay = defaultSchedule.find(d => d.dayOfWeek === dayOfWeek)
      schedule.push({
        name: dayName!,
        hours: defaultDay?.hours || 'Members 24/7',
        isOpen: defaultDay?.isOpen || false,
        dayOfWeek: dayOfWeek
      })
    }
  }

  return schedule
})

const loadOpenHours = async () => {
  try {
    loading.value = true

    // Get ALL events for the next month to find recurring open hours
    const events = await calendarService.getAllEvents(30)

    // Filter for "Open Hours" events
    openHoursEvents.value = events.filter(event =>
      event.title.toLowerCase().includes('open hours')
    )

    // Force reactive update
    scheduleVersion.value++
  } catch (error) {
    console.error('Failed to load open hours:', error)
    // Will fall back to default schedule
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadOpenHours()
})
</script>

<style scoped>
.schedule__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
}

.schedule__title {
  font-size: var(--text-3xl);
  font-weight: var(--font-normal);
  font-family: var(--font-mono);
  color: var(--ink-black);
  margin: 0;
}

.schedule__loading {
  text-align: center;
  padding: var(--space-8);
  color: var(--warm-gray);
  font-family: var(--font-sans);
}

.schedule__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--warm-gray);
  padding: 1px;
  border-radius: var(--radius-base);
  overflow: hidden;
}

.schedule__day {
  background: var(--paper-white);
  padding: var(--space-4);
  text-align: center;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-2);
}

.schedule__day--open {
  background: rgba(122, 139, 127, 0.1);
}

.schedule__day-name {
  font-weight: var(--font-semibold);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--graphite);
  font-family: var(--font-mono);
}

.schedule__day-hours {
  font-size: var(--text-sm);
  color: var(--ink-black);
  font-family: var(--font-sans);
  font-weight: var(--font-medium);
}

.schedule__day--open .schedule__day-hours {
  color: var(--paper-white);
  font-weight: var(--font-semibold);
}

/* Responsive */
@media (max-width: 768px) {
  .schedule__header {
    flex-direction: column;
    gap: var(--space-4);
    align-items: center;
  }

  .schedule__title {
    font-size: var(--text-2xl);
  }

  .schedule__grid {
    grid-template-columns: 1fr;
  }

  .schedule__day {
    min-height: 60px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }

  .schedule__day-name {
    font-size: var(--text-sm);
  }
}
</style>