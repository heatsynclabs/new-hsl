<template>
  <div class="full-calendar">
    <!-- Recurring Events section -->
    <div v-if="!loading && recurringEvents.length > 0" class="events-list recurring-section content-constrained">
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

    <div class="calendar-header content-constrained">
      <div class="header-top-row">
        <div class="view-toggle">
          <button
            :class="['view-toggle-btn', { active: viewMode === 'month' }]"
            @click="viewMode = 'month'"
          >Month</button>
          <button
            :class="['view-toggle-btn', { active: viewMode === 'day' }]"
            @click="switchToDayView()"
          >Day</button>
        </div>
      </div>
      <div class="header-nav-row">
        <button @click="viewMode === 'day' ? previousDay() : previousMonth()" class="nav-button">
          ←
        </button>
        <h2 class="month-year">
          {{ viewMode === 'day' && selectedDay ? format(selectedDay, 'EEEE, MMMM d, yyyy') : formatMonthYear(currentDate) }}
        </h2>
        <button @click="viewMode === 'day' ? nextDay() : nextMonth()" class="nav-button">
          →
        </button>
      </div>
    </div>

    <div v-if="error" class="calendar-error content-constrained">
      <p>Unable to load calendar events. Please try again later.</p>
      <button @click="loadEvents" class="nav-button">Retry</button>
    </div>

    <div v-else-if="loading" class="calendar-loading content-constrained">
      <p>Loading calendar...</p>
    </div>

    <!-- Day View -->
    <div v-else-if="viewMode === 'day'" class="day-view content-constrained">
      <div v-if="selectedDayEvents.length === 0" class="day-view-empty">
        No events on this day.
      </div>
      <div
        v-for="event in selectedDayEvents"
        :key="event.id"
        class="day-view-event"
        @click="openEventModal(event)"
      >
        <div class="day-view-event-time">{{ formatEventTime(event) }}</div>
        <div class="day-view-event-body">
          <div class="day-view-event-title">{{ event.displayTitle }}</div>
          <div v-if="event.requiresRegistration" class="day-view-event-registration">
            <svg class="registration-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Registration required<span v-if="event.registrationCost"> · {{ event.registrationCost }}</span>
          </div>
          <div v-if="event.location" class="day-view-event-location">
            <svg class="location-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            {{ event.location }}
          </div>
          <div v-if="event.description" class="day-view-event-desc" v-html="event.description"></div>
        </div>
      </div>
    </div>

    <!-- Month View -->
    <div
      v-else
      class="calendar-grid"
    >
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
        v-for="(day, index) in calendarDays"
        :key="`${day.date.getTime()}`"
        :class="[
          'calendar-day',
          {
            'other-month': !day.isCurrentMonth,
            'today': day.isToday,
            'has-events': day.events.length > 0
          }
        ]"
        @click="onDayClick(day)"
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
            @click.stop="openEventModal(event)"
          >
            <span class="event-time-inline">{{ formatEventTimeShort(event) }}</span>
            <span class="event-title">{{ event.title }}</span>
          </div>
          <div v-if="day.events.length > 3" class="more-events" @click.stop="onDayClick(day)">
            +{{ day.events.length - 3 }} more
          </div>
        </div>
      </div>
    </div>

    <!-- One-time Events section -->
    <div v-if="!loading && oneTimeEvents.length > 0" class="events-list content-constrained">
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
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, addDays, subDays, isToday, startOfDay, endOfDay } from 'date-fns'
import EventCard from '../events/EventCard.vue'
import EventModal from '../events/EventModal.vue'
import { CalendarService, type CalendarEvent } from '../../services/calendarService'

// Start with current month, but if we're in the last week, show next month
const getInitialDate = () => {
  const today = new Date()
  if (today.getDate() > 23) {
    return addMonths(today, 1)
  }
  return today
}

const currentDate = ref(getInitialDate())
const allEvents = ref<CalendarEvent[]>([])
const futureEvents = ref<CalendarEvent[]>([])
const loading = ref(true)
const error = ref(false)
const modalVisible = ref(false)
const selectedEvent = ref<CalendarEvent | null>(null)

// View mode
const viewMode = ref<'month' | 'day'>('month')
const selectedDay = ref<Date | null>(null)

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
      const dayStart = startOfDay(day)
      const eventStart = startOfDay(event.start)
      const eventEnd = startOfDay(event.end)
      return dayStart >= eventStart && dayStart <= eventEnd
    })
  }))
})

const onDayClick = (day: { date: Date; events: CalendarEvent[] }) => {
  selectedDay.value = day.date
  viewMode.value = 'day'
}

// Day view events
const selectedDayEvents = computed(() => {
  if (!selectedDay.value) return []
  const dayStart = startOfDay(selectedDay.value)
  const dayEnd = endOfDay(selectedDay.value)
  return allEvents.value.filter(event => {
    const eventStart = startOfDay(event.start)
    const eventEnd = startOfDay(event.end)
    return dayStart >= eventStart && dayStart <= eventEnd
  }).sort((a, b) => {
    if (a.isAllDay && !b.isAllDay) return -1
    if (!a.isAllDay && b.isAllDay) return 1
    return a.start.getTime() - b.start.getTime()
  })
})

const switchToDayView = () => {
  if (!selectedDay.value) {
    selectedDay.value = new Date()
  }
  viewMode.value = 'day'
}

const previousDay = () => {
  if (!selectedDay.value) return
  selectedDay.value = subDays(selectedDay.value, 1)
  // If we cross month boundary, update currentDate and reload
  if (!isSameMonth(selectedDay.value, currentDate.value)) {
    currentDate.value = selectedDay.value
    loadEvents()
  }
}

const nextDay = () => {
  if (!selectedDay.value) return
  selectedDay.value = addDays(selectedDay.value, 1)
  if (!isSameMonth(selectedDay.value, currentDate.value)) {
    currentDate.value = selectedDay.value
    loadEvents()
  }
}

const recurringEvents = computed(() => {
  const eventGroups = futureEvents.value.reduce((groups, event) => {
    const title = event.title.toLowerCase()
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

  const recurring = Object.entries(eventGroups)
    .filter(([_, events]) => events.length > 1)
    .map(([_, events]) => {
      const sortedEvents = events.sort((a, b) => a.start.getTime() - b.start.getTime())
      return {
        title: sortedEvents[0]!.title,
        description: sortedEvents[0]!.description,
        nextDate: sortedEvents[0]!.start,
        totalCount: sortedEvents.length,
        event: sortedEvents[0]!
      }
    })

  return recurring.sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())
})

const oneTimeEvents = computed(() => {
  const eventGroups = futureEvents.value.reduce((groups, event) => {
    const key = event.title.toLowerCase()
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(event)
    return groups
  }, {} as Record<string, CalendarEvent[]>)

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
  if (typeof window === 'undefined') return truncateTitle(title, 15)
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

const truncateDescription = (desc: string) => {
  if (desc.length <= 120) return desc
  return desc.substring(0, 117).trim() + '...'
}

const formatEventTime = (event: CalendarEvent) => {
  if (event.isAllDay) {
    return 'All Day'
  }
  return `${format(event.start, 'h:mm a')} - ${format(event.end, 'h:mm a')}`
}

const formatEventTimeShort = (event: CalendarEvent) => {
  if (event.isAllDay) return 'All Day'
  return `${format(event.start, 'h:mma').toLowerCase()}-${format(event.end, 'h:mma').toLowerCase()}`
}

const previousMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1)
  selectedDay.value = null
  loadEvents()
}

const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1)
  selectedDay.value = null
  loadEvents()
}

let requestId = 0

const loadEvents = async () => {
  const thisRequest = ++requestId
  try {
    loading.value = true
    error.value = false

    const [monthEvents, upcomingEvents] = await Promise.all([
      calendarService.getEventsForMonth(currentDate.value),
      calendarService.getRecurringEvents(90)
    ])

    if (thisRequest !== requestId) return

    allEvents.value = monthEvents
    futureEvents.value = upcomingEvents
  } catch (err) {
    if (thisRequest !== requestId) return
    console.error('Failed to load calendar events:', err)
    error.value = true
  } finally {
    if (thisRequest === requestId) loading.value = false
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
  max-width: 100%;
  margin: 0 auto;
}

.content-constrained {
  max-width: var(--container-xl);
  margin-left: auto;
  margin-right: auto;
}

.calendar-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
  padding: var(--space-6) 0 var(--space-4);
}

.header-top-row {
  display: flex;
  justify-content: center;
}

.header-nav-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  width: 100%;
  justify-content: center;
}

.view-toggle {
  display: flex;
  gap: 0;
  border: 1px solid var(--color-text-tertiary);
  border-radius: var(--radius-base);
  overflow: hidden;
}

.view-toggle-btn {
  padding: var(--space-1) var(--space-4);
  background: var(--color-bg-secondary);
  border: none;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  cursor: pointer;
  transition: all var(--transition-base);
}

.view-toggle-btn.active {
  background: var(--color-accent-primary);
  color: var(--color-bg-primary);
}

.month-year {
  font-size: var(--text-3xl);
  font-weight: var(--font-normal);
  color: var(--color-text-primary);
  text-align: center;
}

.nav-button {
  padding: var(--space-2) var(--space-4);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-text-tertiary);
  border-radius: var(--radius-base);
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
  font-size: var(--text-base);
  cursor: pointer;
  transition: all var(--transition-base);
  flex-shrink: 0;
}

.nav-button:hover {
  background: var(--color-accent-primary);
  color: var(--color-bg-secondary);
  border-color: var(--color-accent-primary);
}

.calendar-loading {
  text-align: center;
  padding: var(--space-16);
  color: var(--color-text-tertiary);
}

.calendar-error {
  text-align: center;
  padding: var(--space-16);
  color: var(--color-accent-primary);
}

/* Month view grid */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--color-text-tertiary);
  border-radius: var(--radius-base);
  overflow: hidden;
  margin-bottom: var(--space-12);
}

.day-header {
  background: var(--color-text-primary);
  color: var(--color-bg-primary);
  padding: var(--space-3);
  text-align: center;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  font-family: var(--font-mono);
  letter-spacing: var(--tracking-wide);
}

.calendar-day {
  background: var(--color-bg-primary);
  min-height: 120px;
  padding: var(--space-2);
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.calendar-day.other-month {
  background: var(--color-bg-secondary);
  opacity: 0.5;
}

.calendar-day.today {
  background: rgba(168, 90, 60, 0.1);
}

.calendar-day.today .day-number {
  background: var(--color-accent-primary);
  color: var(--color-bg-primary);
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
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.day-events {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.event-dot {
  background: var(--color-accent-primary);
  color: var(--color-bg-primary);
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

.event-time-inline {
  display: block;
  font-size: 9px;
  opacity: 0.85;
  font-family: var(--font-mono);
}

.more-events {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  text-align: center;
  padding: var(--space-1);
  font-family: var(--font-mono);
  cursor: pointer;
}

.more-events:hover {
  color: var(--color-accent-primary);
}

/* Day View */
.day-view {
  margin-bottom: var(--space-12);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.day-view-empty {
  text-align: center;
  padding: var(--space-16);
  color: var(--color-text-tertiary);
  font-family: var(--font-sans);
}

.day-view-event {
  display: flex;
  gap: var(--space-4);
  background: var(--color-bg-secondary);
  border-left: 3px solid var(--color-accent-primary);
  border-radius: var(--radius-base);
  padding: var(--space-4);
  cursor: pointer;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.day-view-event:hover {
  transform: translateX(2px);
  box-shadow: 2px 2px 8px var(--shadow-light);
}

.day-view-event-time {
  color: var(--color-accent-primary);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  min-width: 100px;
  flex-shrink: 0;
}

.day-view-event-body {
  flex: 1;
  min-width: 0;
}

.day-view-event-title {
  color: var(--color-text-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-2);
}

.day-view-event-registration {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  color: var(--accent-sage);
  font-family: var(--font-sans);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-2);
  padding: var(--space-1) var(--space-2);
  background: rgba(104, 127, 93, 0.1);
  border-radius: var(--radius-sm);
  width: fit-content;
}

.day-view-event-registration .registration-icon {
  width: 14px;
  height: 14px;
  color: var(--accent-sage);
  flex-shrink: 0;
}

.day-view-event-location {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  font-family: var(--font-sans);
  margin-bottom: var(--space-2);
}

.day-view-event-location .location-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.day-view-event-desc {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  font-family: var(--font-sans);
}

.day-view-event-desc :deep(a) {
  color: var(--color-accent-primary);
  text-decoration: underline;
}

.day-view-event-desc :deep(br) {
  display: block;
  margin-top: var(--space-1);
}

/* Sections below calendar */
.events-list {
  margin-top: var(--space-12);
}

.events-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-6);
  color: var(--color-text-primary);
  text-align: center;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-4);
}

.recurring-section {
  margin-bottom: var(--space-6);
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
  background: var(--color-text-tertiary);
  border-radius: var(--radius-full);
}

.recurring-events-carousel::-webkit-scrollbar-thumb {
  background: var(--accent-sage);
  border-radius: var(--radius-full);
}

.recurring-events-carousel::-webkit-scrollbar-thumb:hover {
  background: var(--color-accent-primary);
}

.recurring-event-item {
  background: var(--color-bg-secondary);
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
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  margin: 0;
}

.recurring-event-next {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-accent-primary);
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
}

.recurring-event-next .calendar-icon {
  width: 16px;
  height: 16px;
  color: var(--color-accent-primary);
}


/* Responsive */
@media (max-width: 1024px) {
  .full-calendar {
    padding: 0 var(--space-4);
  }

  .month-year {
    font-size: var(--text-2xl);
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

  .month-year {
    font-size: var(--text-lg);
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

  .event-time-inline {
    display: none;
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

  /* Day view mobile: stack time above title */
  .day-view-event {
    flex-direction: column;
    gap: var(--space-1);
  }

  .day-view-event-time {
    min-width: unset;
  }

  .day-view-event-title {
    font-size: var(--text-base);
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
    gap: var(--space-1);
  }

  .month-year {
    font-size: var(--text-base);
  }

  .nav-button {
    padding: var(--space-1) var(--space-3);
    font-size: var(--text-sm);
  }

  .view-toggle-btn {
    padding: var(--space-1) var(--space-2);
    font-size: 10px;
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

  .day-view {
    padding: 0 var(--space-2);
  }

  .day-view-event {
    padding: var(--space-3);
  }

  .day-view-event-title {
    font-size: var(--text-sm);
  }

  .day-view-event-desc {
    font-size: var(--text-xs);
  }
}

/* Ultra small screens */
@media (max-width: 360px) {
  .month-year {
    font-size: var(--text-sm);
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
