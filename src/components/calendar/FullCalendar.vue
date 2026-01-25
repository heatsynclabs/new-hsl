<template>
  <div class="full-calendar">
    <!-- Recurring Events section -->
    <div v-if="!loading && recurringEvents.length > 0" class="events-list">
      <h3 class="events-title">Recurring Events</h3>
      <div class="recurring-events-carousel">
        <div
          v-for="recurring in recurringEvents"
          :key="recurring.title"
          class="recurring-event-item"
          @click="openEventModal(recurring.event!)"
        >
          <div class="recurring-event-content">
            <h4 class="recurring-event-title">{{ recurring.title }}</h4>
            <div class="recurring-event-next">
              <svg class="calendar-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Next: {{ format(recurring.nextDate, 'MMM d, yyyy') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="calendar-header">
      <button @click="previousMonth" class="nav-button">
        ← Previous
      </button>
      <h2 class="month-year">{{ formatMonthYear(currentDate) }}</h2>
      <button @click="nextMonth" class="nav-button">
        Next →
      </button>
    </div>

    <div v-if="loading" class="calendar-loading">
      <p>Loading calendar...</p>
    </div>

    <div v-else class="calendar-grid">
      <!-- Day headers -->
      <div
        v-for="day in dayHeaders"
        :key="day"
        class="day-header"
      >
        {{ day }}
      </div>

      <!-- Calendar days -->
      <div
        v-for="day in calendarDays"
        :key="`${day.date.getTime()}`"
        :class="[
          'calendar-day',
          {
            'other-month': !day.isCurrentMonth,
            'today': day.isToday,
            'has-events': day.events.length > 0
          }
        ]"
      >
        <div class="day-number">{{ day.date.getDate() }}</div>
        <div v-if="day.events.length > 0" class="day-events">
          <div
            v-for="event in day.events.slice(0, 3)"
            :key="event.id"
            :class="[
              'event-dot',
              { 'all-day': event.isAllDay }
            ]"
            :title="`${event.title} - ${formatEventTime(event)}`"
            @click="openEventModal(event)"
          >
            <span class="event-title">{{ getTruncatedTitle(event.title) }}</span>
          </div>
          <div v-if="day.events.length > 3" class="more-events">
            +{{ day.events.length - 3 }} more
          </div>
        </div>
      </div>
    </div>

    <!-- One-time Events section -->
    <div v-if="!loading && oneTimeEvents.length > 0" class="events-list">
      <h3 class="events-title">Upcoming Events</h3>
      <div class="events-grid">
        <EventCard
          v-for="event in oneTimeEvents"
          :key="event.id"
          :event="event"
          @click="(e: CalendarEvent) => openEventModal(e)"
        />
      </div>
    </div>

    <EventModal
      :visible="modalVisible"
      :event="selectedEvent"
      @close="closeEventModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, isToday, getWeek, getDay, startOfDay, endOfDay, isWithinInterval } from 'date-fns'
import EventCard from '../events/EventCard.vue'
import EventModal from '../events/EventModal.vue'
import { CalendarService, type CalendarEvent } from '../../services/calendarService'

// Start with current month, but if we're in the last week, show next month
const getInitialDate = () => {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Get the last day of current month
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)

  // If today is in the last week of the month (after the 23rd), show next month
  if (today.getDate() > 23) {
    return addMonths(today, 1)
  }

  return today
}

const currentDate = ref(getInitialDate())
const allEvents = ref<CalendarEvent[]>([])
const futureEvents = ref<CalendarEvent[]>([])
const loading = ref(true)
const modalVisible = ref(false)
const selectedEvent = ref<CalendarEvent | null>(null)

const calendarService = new CalendarService()

const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calendarDays = computed(() => {
  const monthStart = startOfMonth(currentDate.value)
  const monthEnd = endOfMonth(currentDate.value)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  return days.map(day => ({
    date: day,
    isCurrentMonth: isSameMonth(day, currentDate.value),
    isToday: isToday(day),
    events: allEvents.value.filter(event => {
      // Check if this day falls within the event's date range (for multi-day events)
      const dayStart = startOfDay(day)
      const dayEnd = endOfDay(day)
      const eventStart = startOfDay(event.start)
      const eventEnd = startOfDay(event.end)

      // Event spans this day if: eventStart <= day <= eventEnd
      return dayStart >= eventStart && dayStart <= eventEnd
    })
  }))
})

const recurringEvents = computed(() => {
  // Group events by title to identify recurring events
  const eventGroups = futureEvents.value.reduce((groups, event) => {
    const title = event.title.toLowerCase()
    // Exclude Open Hours and Member Hours
    if (title.includes('open hours') || title.includes('member hours')) {
      return groups
    }

    const key = title
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(event)
    return groups
  }, {} as Record<string, CalendarEvent[]>)

  // Filter for recurring events (more than one occurrence)
  const recurring = Object.entries(eventGroups)
    .filter(([_, events]) => events.length > 1)
    .map(([_, events]) => {
      const sortedEvents = events.sort((a, b) => a.start.getTime() - b.start.getTime())
      return {
        title: sortedEvents[0]!.title,
        description: sortedEvents[0]!.description,
        nextDate: sortedEvents[0]!.start,
        totalCount: sortedEvents.length,
        event: sortedEvents[0]! // For modal
      }
    })

  return recurring.sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())
})

const oneTimeEvents = computed(() => {
  // Group events by title to identify one-time events
  const eventGroups = futureEvents.value.reduce((groups, event) => {
    const key = event.title.toLowerCase()
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(event)
    return groups
  }, {} as Record<string, CalendarEvent[]>)

  // Filter for one-time events (only one occurrence)
  const oneTime = Object.entries(eventGroups)
    .filter(([_, events]) => events.length === 1)
    .map(([_, events]) => events[0]!)

  return oneTime.sort((a, b) => a!.start.getTime() - b!.start.getTime())
})

const formatMonthYear = (date: Date) => {
  return format(date, 'MMMM yyyy')
}

const truncateTitle = (title: string, maxLength: number) => {
  if (title.length <= maxLength) return title
  return title.substring(0, maxLength) + '...'
}

const getTruncatedTitle = (title: string) => {
  // Responsive title truncation based on screen size
  if (window.innerWidth <= 360) {
    return truncateTitle(title, 6)
  } else if (window.innerWidth <= 480) {
    return truncateTitle(title, 8)
  } else if (window.innerWidth <= 768) {
    return truncateTitle(title, 10)
  } else {
    return truncateTitle(title, 15)
  }
}

const formatEventTime = (event: CalendarEvent) => {
  if (event.isAllDay) {
    return 'All Day'
  }
  return `${format(event.start, 'h:mm a')} - ${format(event.end, 'h:mm a')}`
}

const previousMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1)
  loadEvents()
}

const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1)
  loadEvents()
}

const loadEvents = async () => {
  try {
    loading.value = true

    // Load both month events for the calendar grid and get recurring events specifically
    const [monthEvents, upcomingEvents] = await Promise.all([
      calendarService.getEventsForMonth(currentDate.value),
      calendarService.getRecurringEvents(90) // Next 3 months using recurring events API
    ])

    allEvents.value = monthEvents
    futureEvents.value = upcomingEvents

    console.log(`Loaded ${allEvents.value.length} events for ${format(currentDate.value, 'MMMM yyyy')}`)
    console.log(`Loaded ${futureEvents.value.length} upcoming events (next 4 weeks)`)
  } catch (error) {
    console.error('Failed to load calendar events:', error)
  } finally {
    loading.value = false
  }
}

const openEventModal = (event: CalendarEvent) => {
  selectedEvent.value = event
  modalVisible.value = true
}

const closeEventModal = () => {
  modalVisible.value = false
  selectedEvent.value = null
}

onMounted(() => {
  loadEvents()
})
</script>

<style scoped>
.full-calendar {
  max-width: 1200px;
  margin: 0 auto;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
  padding: var(--space-4) 0;
}

.month-year {
  font-size: var(--text-3xl);
  font-weight: var(--font-normal);
  color: var(--ink-black);
}

.nav-button {
  padding: var(--space-3) var(--space-6);
  background: var(--cream);
  border: 1px solid var(--warm-gray);
  border-radius: var(--radius-base);
  color: var(--graphite);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-base);
}

.nav-button:hover {
  background: var(--accent-rust);
  color: var(--cream);
  border-color: var(--accent-rust);
}

.calendar-loading {
  text-align: center;
  padding: var(--space-16);
  color: var(--warm-gray);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--warm-gray);
  border-radius: var(--radius-base);
  overflow: hidden;
  margin-bottom: var(--space-12);
}

.day-header {
  background: var(--ink-black);
  color: var(--paper-white);
  padding: var(--space-3);
  text-align: center;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  font-family: var(--font-mono);
  letter-spacing: var(--tracking-wide);
}

.calendar-day {
  background: var(--paper-white);
  min-height: 120px;
  padding: var(--space-2);
  display: flex;
  flex-direction: column;
  position: relative;
}

.calendar-day.other-month {
  background: var(--cream);
  opacity: 0.5;
}

.calendar-day.today {
  background: rgba(168, 90, 60, 0.1);
}

.calendar-day.today .day-number {
  background: var(--accent-rust);
  color: var(--paper-white);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-number {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--ink-black);
  margin-bottom: var(--space-1);
}

.day-events {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.event-dot {
  background: var(--accent-rust);
  color: var(--paper-white);
  padding: var(--space-1);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  line-height: 1.2;
  cursor: pointer;
  transition: all var(--transition-base);
}

.event-dot:hover {
  background: var(--accent-sage);
  transform: scale(1.02);
}

.event-dot.all-day {
  background: var(--accent-sage);
}

.event-title {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-events {
  font-size: var(--text-xs);
  color: var(--warm-gray);
  text-align: center;
  padding: var(--space-1);
  font-family: var(--font-mono);
}

.events-list {
  margin-top: var(--space-12);
}

.events-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-6);
  color: var(--ink-black);
  text-align: center;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-4);
}

.recurring-events-carousel {
  display: flex;
  gap: var(--space-4);
  overflow-x: auto;
  padding: var(--space-2) 0 var(--space-4) 0;
  scroll-behavior: smooth;
}

.recurring-events-carousel::-webkit-scrollbar {
  height: 8px;
}

.recurring-events-carousel::-webkit-scrollbar-track {
  background: var(--warm-gray);
  border-radius: var(--radius-full);
}

.recurring-events-carousel::-webkit-scrollbar-thumb {
  background: var(--accent-sage);
  border-radius: var(--radius-full);
}

.recurring-events-carousel::-webkit-scrollbar-thumb:hover {
  background: var(--accent-rust);
}

.recurring-event-item {
  background: var(--cream);
  border-radius: var(--radius-base);
  padding: var(--space-4);
  cursor: pointer;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  box-shadow: 2px 2px 8px var(--shadow-light);
  position: relative;
  flex: 0 0 320px;
  min-height: 120px;
}

.recurring-event-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--accent-sage);
  border-radius: var(--radius-base) var(--radius-base) 0 0;
}

.recurring-event-item:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 10px var(--shadow-medium);
}

.recurring-event-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.recurring-event-title {
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  color: var(--ink-black);
  font-family: var(--font-sans);
  margin: 0;
}

.recurring-event-next {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--accent-rust);
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
}

.recurring-event-next .calendar-icon {
  width: 16px;
  height: 16px;
  color: var(--accent-rust);
}


/* Responsive */
@media (max-width: 1024px) {
  .full-calendar {
    padding: 0 var(--space-4);
  }

  .calendar-header {
    margin-bottom: var(--space-6);
  }

  .month-year {
    font-size: var(--text-2xl);
  }

  .nav-button {
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-xs);
  }

  .calendar-day {
    min-height: 100px;
  }

  .recurring-event-item {
    flex: 0 0 280px;
  }
}

@media (max-width: 768px) {
  .full-calendar {
    padding: 0 var(--space-2);
  }

  .calendar-header {
    flex-direction: column;
    gap: var(--space-3);
    text-align: center;
  }

  .month-year {
    font-size: var(--text-xl);
    order: -1;
  }

  .nav-button {
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-xs);
    flex: 1;
    max-width: 120px;
  }

  .calendar-grid {
    font-size: var(--text-xs);
    margin-bottom: var(--space-8);
  }

  .day-header {
    padding: var(--space-2);
    font-size: var(--text-xs);
  }

  .calendar-day {
    min-height: 70px;
    padding: var(--space-1);
  }

  .day-number {
    font-size: var(--text-xs);
    margin-bottom: 2px;
  }

  .event-dot {
    padding: 1px var(--space-1);
    font-size: 10px;
  }

  .event-title {
    line-height: 1.1;
  }

  .more-events {
    font-size: 10px;
    padding: 1px;
  }

  .events-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  .recurring-event-item {
    flex: 0 0 260px;
    min-height: 100px;
    padding: var(--space-3);
  }

  .recurring-event-title {
    font-size: var(--text-base);
    line-height: 1.3;
  }

  .recurring-event-next {
    font-size: var(--text-xs);
  }

  .events-list {
    margin-top: var(--space-8);
  }

  .events-title {
    font-size: var(--text-xl);
    margin-bottom: var(--space-4);
  }
}

@media (max-width: 480px) {
  .full-calendar {
    padding: 0;
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
  }

  .calendar-header {
    padding: 0 var(--space-2);
    gap: var(--space-2);
    width: 100%;
    box-sizing: border-box;
  }

  .month-year {
    font-size: var(--text-lg);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nav-button {
    padding: var(--space-1) var(--space-2);
    font-size: 10px;
    border-radius: var(--radius-sm);
    white-space: nowrap;
    min-width: 60px;
  }

  .calendar-grid {
    border-radius: 0;
    margin-bottom: var(--space-6);
    width: 100%;
    max-width: 100vw;
    overflow: hidden;
    box-sizing: border-box;
  }

  .day-header {
    padding: var(--space-1);
    font-size: 9px;
    text-align: center;
    overflow: hidden;
  }

  .calendar-day {
    min-height: 50px;
    padding: 1px;
    overflow: hidden;
    box-sizing: border-box;
  }

  .day-number {
    font-size: 10px;
    margin-bottom: 1px;
    text-align: center;
  }

  .calendar-day.today .day-number {
    width: 16px;
    height: 16px;
    font-size: 9px;
  }

  .day-events {
    gap: 1px;
  }

  .event-dot {
    padding: 1px;
    font-size: 8px;
    border-radius: 1px;
    margin-bottom: 1px;
    overflow: hidden;
  }

  .event-title {
    line-height: 1;
    font-size: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .more-events {
    font-size: 7px;
    margin-top: 1px;
    text-align: center;
  }

  .recurring-events-carousel {
    padding: 0 var(--space-2);
    gap: var(--space-2);
    width: 100%;
    box-sizing: border-box;
  }

  .recurring-event-item {
    flex: 0 0 220px;
    min-height: 80px;
    padding: var(--space-2);
  }

  .recurring-event-title {
    font-size: var(--text-sm);
    line-height: 1.2;
  }

  .recurring-event-next {
    font-size: 10px;
    gap: var(--space-1);
  }

  .recurring-event-next .calendar-icon {
    width: 10px;
    height: 10px;
  }

  .events-list {
    margin-top: var(--space-4);
    padding: 0 var(--space-2);
    width: 100%;
    box-sizing: border-box;
  }

  .events-title {
    font-size: var(--text-lg);
    margin-bottom: var(--space-3);
  }
}

/* Ultra small screens */
@media (max-width: 360px) {
  .calendar-header {
    padding: 0 var(--space-1);
  }

  .month-year {
    font-size: var(--text-base);
  }

  .nav-button {
    padding: var(--space-1);
    font-size: 9px;
    min-width: 50px;
  }

  .calendar-day {
    min-height: 45px;
    padding: 1px;
  }

  .day-header {
    padding: 2px;
    font-size: 8px;
  }

  .day-number {
    font-size: 9px;
  }

  .calendar-day.today .day-number {
    width: 14px;
    height: 14px;
    font-size: 8px;
  }

  .event-dot {
    font-size: 7px;
    padding: 1px;
  }

  .event-title {
    font-size: 7px;
  }

  .more-events {
    font-size: 6px;
  }

  .recurring-event-item {
    flex: 0 0 180px;
    min-height: 70px;
    padding: var(--space-1);
  }

  .recurring-event-title {
    font-size: var(--text-xs);
    line-height: 1.1;
  }

  .recurring-event-next {
    font-size: 9px;
  }

  .recurring-event-next .calendar-icon {
    width: 8px;
    height: 8px;
  }

  .events-list {
    padding: 0 var(--space-1);
  }

  .events-title {
    font-size: var(--text-base);
  }
}
</style>