<template>
  <BaseCard padding="lg" :class="['schedule', { 'schedule--compact': props.forceCompact }]">
    <div class="schedule__header">
      <div class="schedule__header-content">
        <h2 class="schedule__title">Open Hours</h2>
        <p v-if="!props.hideDescription" class="schedule__description">
          Open hours are times when the lab is open to the public. Stop in, get a tour, meet us, and even work on your projects! Card members get 24/7 access to the space.
        </p>
      </div>
      <DoorStatus v-if="!props.forceCompact" />
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

const props = defineProps<{
  forceCompact?: boolean
  hideDescription?: boolean
}>()

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

// Default schedule as fallback - all days show Card members 24/7 when no Open Hours events found
const defaultSchedule: ScheduleDay[] = [
  { name: 'SUNDAY', hours: 'Card members 24/7', isOpen: false, dayOfWeek: 0 },
  { name: 'MONDAY', hours: 'Card members 24/7', isOpen: false, dayOfWeek: 1 },
  { name: 'TUESDAY', hours: 'Card members 24/7', isOpen: false, dayOfWeek: 2 },
  { name: 'WEDNESDAY', hours: 'Card members 24/7', isOpen: false, dayOfWeek: 3 },
  { name: 'THURSDAY', hours: 'Card members 24/7', isOpen: false, dayOfWeek: 4 },
  { name: 'FRIDAY', hours: 'Card members 24/7', isOpen: false, dayOfWeek: 5 },
  { name: 'SATURDAY', hours: 'Card members 24/7', isOpen: false, dayOfWeek: 6 },
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
      // Show ALL open-hours windows for this day (e.g. a morning and an evening block)
      const ranges = [...dayEvents]
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .map(ev => ev.isAllDay
          ? 'All Day'
          : `${format(ev.start, 'h:mm a')} - ${format(ev.end, 'h:mm a')}`)

      // Wednesday always advertises the public 10am–3pm open block as well
      if (dayOfWeek === 3 && !ranges.some(r => r.startsWith('10:00 AM'))) {
        ranges.unshift('10:00 AM - 3:00 PM')
      }

      schedule.push({
        name: dayName!,
        hours: [...new Set(ranges)].join('\n'),
        isOpen: true,
        dayOfWeek: dayOfWeek
      })
    } else if (dayOfWeek === 3) {
      // No calendar events yet, but Wednesday still has the standing 10am–3pm block
      schedule.push({
        name: dayName!,
        hours: '10:00 AM - 3:00 PM',
        isOpen: true,
        dayOfWeek: dayOfWeek
      })
    } else {
      // Use default for this day
      const defaultDay = defaultSchedule.find(d => d.dayOfWeek === dayOfWeek)
      schedule.push({
        name: dayName!,
        hours: defaultDay?.hours || 'Card members 24/7',
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
  align-items: flex-start;
  margin-bottom: var(--space-8);
}

.schedule__header-content {
  flex: 1;
  max-width: 70%;
}

.schedule__title {
  font-size: var(--text-4xl);
  font-weight: 400;
  font-family: var(--font-display);
  color: var(--color-text-primary);
  margin: 0;
  line-height: 0.95;
  text-shadow: none;
}

.schedule__description {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin: var(--space-4) 0 0 0;
  text-align: left;
}

.schedule__loading {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-text-tertiary);
  font-family: var(--font-body);
}

/* The Open Hours card itself has no outer "white rectangle" border or shadow;
   its padding stays, and the 7-day grid border is the single container. */
:global(.card.schedule) {
  border: none;
  box-shadow: none;
}

.schedule__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  background: var(--color-text-primary);
  padding: 2px;
  border: var(--color-border-thick);
  overflow: hidden;
}

.schedule__day {
  background: var(--color-bg-secondary);
  padding: var(--space-4) var(--space-3);
  text-align: center;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-2);
  border-top: 5px solid var(--day-color, var(--orange));
}

/* Day-of-week rainbow - color is decorative; the day name + hours carry the meaning */
.schedule__day:nth-child(1) { --day-color: var(--day-sun); }
.schedule__day:nth-child(2) { --day-color: var(--day-mon); }
.schedule__day:nth-child(3) { --day-color: var(--day-tue); }
.schedule__day:nth-child(4) { --day-color: var(--day-wed); }
.schedule__day:nth-child(5) { --day-color: var(--day-thu); }
.schedule__day:nth-child(6) { --day-color: var(--day-fri); }
.schedule__day:nth-child(7) { --day-color: var(--day-sat); }

.schedule__day-name {
  font-weight: 400;
  font-size: var(--text-lg);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--day-color, var(--color-text-secondary));
  font-family: var(--font-ui);
}

.schedule__day-hours {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-weight: var(--font-normal);
  white-space: pre-line;
}

.schedule__day--open .schedule__day-hours {
  color: var(--color-text-primary);
  font-weight: var(--font-bold);
}

/* Compact (forced vertical list) — used when this card sits inside a narrow column */
.schedule--compact .schedule__header {
  flex-direction: column;
  gap: var(--space-3);
  align-items: flex-start;
}
.schedule--compact .schedule__header-content { max-width: 100%; }
.schedule--compact .schedule__title { font-size: var(--text-3xl); }
.schedule--compact .schedule__grid {
  grid-template-columns: 1fr;
  border: none;
  background: transparent;
  gap: 0;
  padding: 0;
}
.schedule--compact .schedule__day {
  min-height: 52px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  border-top: 4px solid var(--day-color, var(--orange));
  padding: var(--space-3) var(--space-4);
}
.schedule--compact .schedule__day:last-child {
  border-bottom: 4px solid var(--day-color, var(--orange));
}
.schedule--compact .schedule__day-name {
  font-size: var(--text-xs);
  letter-spacing: 0.08em;
}
.schedule--compact .schedule__day-hours {
  font-family: var(--font-ui);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .schedule__header {
    flex-direction: column;
    gap: var(--space-4);
    align-items: center;
  }

  .schedule__header-content {
    max-width: 100%;
  }

  .schedule__title {
    font-size: var(--text-2xl);
  }

  .schedule__description {
    text-align: center;
  }

  /* Mobile: render the days as a clean padded list (card padding stays;
     just the grid box/gaps go), with the colored day bars as separators. */
  .schedule__grid {
    grid-template-columns: 1fr;
    border: none;
    background: transparent;
    gap: 0;
    padding: 0;
  }

  .schedule__day {
    min-height: 60px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    border-top: 4px solid var(--day-color, var(--orange));
  }

  .schedule__day:last-child {
    border-bottom: 4px solid var(--day-color, var(--orange));
  }

  .schedule__day-name {
    font-size: var(--text-base);
  }
}
</style>
