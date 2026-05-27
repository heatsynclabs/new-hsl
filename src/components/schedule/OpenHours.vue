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
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 26px;
}

.schedule__header-content {
  flex: 1;
  min-width: 0;
}

.schedule__title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(30px, 4vw, 44px);
  text-transform: uppercase;
  letter-spacing: -0.01em;
  line-height: 1;
  color: var(--color-text-primary);
  margin: 0;
}

.schedule__description {
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--ash);
  line-height: var(--leading-relaxed);
  margin: 14px 0 0 0;
  max-width: 660px;
}

.schedule__loading {
  padding: var(--space-8);
  color: var(--smoke);
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* The Open Hours card itself has no outer border/shadow — the week grid carries the container. */
:global(.card.schedule) {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

/* Default — Gantry 7-col week grid */
.schedule__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border: var(--bd);
  background: transparent;
}

.schedule__day {
  border-right: var(--bd);
  border-top: 4px solid var(--day-color, var(--hazard));
  padding: 16px 12px;
  text-align: center;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.schedule__day:last-child {
  border-right: 0;
}

/* Day-of-week rainbow — pulls Gantry palette */
.schedule__day:nth-child(1) { --day-color: var(--hazard); }
.schedule__day:nth-child(2) { --day-color: var(--violet); }
.schedule__day:nth-child(3) { --day-color: var(--live); }
.schedule__day:nth-child(4) { --day-color: var(--info); }
.schedule__day:nth-child(5) { --day-color: var(--rust); }
.schedule__day:nth-child(6) { --day-color: var(--hazard-deep); }
.schedule__day:nth-child(7) { --day-color: var(--accent-text); }

.schedule__day-name {
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--smoke);
  margin-bottom: 0;
}

.schedule__day-hours {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.45;
  white-space: pre-line;
}

.schedule__day--open .schedule__day-hours {
  color: var(--color-text-primary);
  font-weight: 600;
}

/* Compact mode — used when sitting in a narrow column. Vertical list. */
.schedule--compact .schedule__header {
  flex-direction: column;
  gap: var(--space-2);
  align-items: flex-start;
  margin-bottom: 20px;
}
.schedule--compact .schedule__title { font-size: 32px; }
.schedule--compact .schedule__grid {
  grid-template-columns: 1fr;
  border: var(--bd);
}
.schedule--compact .schedule__day {
  min-height: 48px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  border-right: 0;
  border-bottom: var(--bd);
  border-top: 0;
  border-left: 4px solid var(--day-color, var(--hazard));
  padding: 12px 16px;
  gap: 12px;
}
.schedule--compact .schedule__day:last-child {
  border-bottom: 0;
}
.schedule--compact .schedule__day-name {
  font-size: 11px;
  letter-spacing: 0.12em;
}
.schedule--compact .schedule__day-hours {
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* Responsive — collapse 7-col grid at 820 to 2-col, then to vertical list pattern at 600 */
@media (max-width: 820px) {
  .schedule__header {
    flex-direction: column;
    gap: var(--space-3);
    align-items: flex-start;
  }
  .schedule__title { font-size: 30px; }
  .schedule__grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .schedule__day {
    border-right: var(--bd);
    border-bottom: var(--bd);
    min-height: 110px;
  }
  .schedule__day:nth-child(2n) {
    border-right: 0;
  }
}

@media (max-width: 480px) {
  .schedule__grid {
    grid-template-columns: 1fr;
  }
  .schedule__day {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    min-height: 56px;
    padding: 14px 16px;
    border-right: 0;
    border-top: 0;
    border-left: 4px solid var(--day-color, var(--hazard));
    border-bottom: var(--bd);
  }
}
</style>
