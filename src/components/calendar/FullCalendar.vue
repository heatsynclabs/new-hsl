<template>
  <div class="full-calendar">
    <!-- Upcoming Events — side-scroll cards, no descriptions, top of page -->
    <section v-if="!loading && upcomingEntries.length > 0" class="cal-section content-constrained">
      <div class="cal-section__head">
        <h2 class="cal-section__title">Upcoming Events</h2>
      </div>
      <EventCarousel :entries="upcomingEntries" @select="openEventModal" />
    </section>

    <!-- Calendar header: view toggle + month nav + search, all one row -->
    <div class="calendar-header content-constrained">
      <div class="view-toggle" role="tablist">
        <button
          :class="['view-toggle-btn', { active: viewMode === 'month' }]"
          role="tab"
          :aria-selected="viewMode === 'month'"
          @click="viewMode = 'month'"
        >Month</button>
        <button
          :class="['view-toggle-btn', { active: viewMode === 'day' }]"
          role="tab"
          :aria-selected="viewMode === 'day'"
          @click="switchToDayView()"
        >Day</button>
      </div>

      <div class="monthnav">
        <button
          class="nav-button"
          :aria-label="viewMode === 'day' ? 'Previous day' : 'Previous month'"
          @click="viewMode === 'day' ? previousDay() : previousMonth()"
        >←</button>
        <h2 class="month-year">
          {{ viewMode === 'day' && selectedDay
            ? format(selectedDay, 'EEE, MMM d')
            : format(currentDate, 'MMMM') }}
        </h2>
        <button
          class="nav-button"
          :aria-label="viewMode === 'day' ? 'Next day' : 'Next month'"
          @click="viewMode === 'day' ? nextDay() : nextMonth()"
        >→</button>
      </div>

      <div class="header-search" :class="{ 'header-search--open': searchOpen }">
        <button
          type="button"
          class="search-toggle"
          :aria-label="searchOpen ? 'Close search' : 'Search this month'"
          :aria-expanded="searchOpen"
          @click="toggleSearch"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
        <input
          v-if="searchOpen"
          ref="searchInputRef"
          v-model="searchQuery"
          type="text"
          class="search-input"
          :placeholder="`Search ${format(currentDate, 'MMMM yyyy')}`"
          @keydown.escape="closeSearch"
        />
        <div v-if="searchOpen && searchQuery" class="search-panel">
          <ul v-if="searchResults.length" class="search-results">
            <li
              v-for="result in searchResults"
              :key="result.id"
              class="search-result"
              @click="onSearchSelect(result)"
            >
              <div class="search-result__title">{{ result.displayTitle || result.title }}</div>
              <div class="search-result__meta">
                {{ format(result.start, 'EEE MMM d') }}<span v-if="!result.isAllDay"> · {{ formatEventTimeShort(result) }}</span>
              </div>
            </li>
          </ul>
          <div v-else class="search-empty">No matches in {{ format(currentDate, 'MMMM') }}</div>
        </div>
      </div>
    </div>

    <!-- Legend — Recurring, Open Hours, Hack, Registration. -->
    <div v-if="viewMode === 'month' && !loading && !error" class="cal-legend content-constrained">
      <span class="cal-legend__item cal-legend__item--recurring">
        <span class="cal-legend__sw"></span>
        Recurring
      </span>
      <span class="cal-legend__item cal-legend__item--group">
        <span class="cal-legend__sw"></span>
        Group
      </span>
      <span class="cal-legend__item cal-legend__item--hack">
        <span class="cal-legend__sw"></span>
        HYH
      </span>
      <span class="cal-legend__item cal-legend__item--open">
        <span class="cal-legend__sw cal-legend__sw--ghost"></span>
        Open Hours
      </span>
      <span class="cal-legend__item cal-legend__item--reg">
        <span class="cal-legend__sw cal-legend__sw--reg">REG</span>
        Registration required
      </span>
    </div>

    <div v-if="error" class="calendar-error content-constrained">
      <p>Unable to load calendar events. Please try again later.</p>
      <button class="nav-button" @click="loadEvents">Retry</button>
    </div>

    <div v-else-if="loading" class="calendar-loading content-constrained">
      <p>Loading calendar...</p>
    </div>

    <!-- Month view: grid (chips on desktop, dots on mobile) -->
    <div v-else-if="viewMode === 'month'" class="month-view content-constrained">
      <div class="calendar-grid">
        <div v-for="day in dayHeaders" :key="day" class="day-header">{{ day }}</div>

        <div
          v-for="day in calendarDays"
          :key="day.date.getTime()"
          :class="[
            'calendar-day',
            {
              'other-month': !day.isCurrentMonth,
              'today': day.isToday,
              'selected': selectedDay && isSameDay(day.date, selectedDay),
            },
          ]"
          @click="onDayClick(day)"
        >
          <div class="day-number">{{ day.date.getDate() }}</div>

          <!-- Desktop chips: title + time -->
          <div v-if="day.events.length > 0" class="day-events day-events--chips">
            <div
              v-for="event in day.events.slice(0, 3)"
              :key="event.id"
              :class="[
                'event-dot',
                `event-dot--${getEventCategory(event)}`,
                { 'event-dot--all-day': event.isAllDay },
              ]"
              :title="`${event.title} - ${formatEventTime(event)}`"
              @click.stop="openEventModal(event)"
            >
              <span v-if="event.requiresRegistration" class="event-dot__reg">REG</span>
              <span class="event-time-inline">{{ formatEventTimeShort(event) }}</span>
              <span class="event-title">{{ event.displayTitle || event.title }}</span>
            </div>
            <div
              v-if="day.events.length > 3"
              class="more-events"
              @click.stop="onDayClick(day)"
            >+{{ day.events.length - 3 }} more</div>
          </div>

          <!-- Mobile icons: one tiny category-tinted icon per event -->
          <div v-if="day.events.length > 0" class="day-events day-events--icons">
            <EventIcon
              v-for="event in day.events.slice(0, 6)"
              :key="`d-${event.id}`"
              :name="iconForEvent(event)"
              :class="['day-glyph', `day-glyph--${getEventCategory(event)}`]"
              :aria-label="event.displayTitle || event.title"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Day view / companion agenda. Always renders the selected day's events.
         In month mode this acts as a companion list below the grid
         (essential on mobile where cells only show dots). In day mode it's
         the only thing on screen. -->
    <div
      v-if="!loading && selectedDay"
      :class="[
        'day-view content-constrained',
        { 'day-view--companion': viewMode === 'month' },
      ]"
    >
      <div class="day-view__head">
        <span class="day-view__date">{{ format(selectedDay, 'EEE · MMM d') }}</span>
        <span class="day-view__count">
          {{ selectedDayEvents.length }} event{{ selectedDayEvents.length === 1 ? '' : 's' }}
        </span>
      </div>
      <p v-if="selectedDayEvents.length === 0" class="day-view-empty">
        No events on this day.
      </p>
      <ul v-else class="rlist">
        <li
          v-for="event in selectedDayEvents"
          :key="event.id"
          :class="['rlist-item', `rlist-item--${getEventCategory(event)}`]"
          @click="openEventModal(event)"
        >
          <div class="rlist-item__head">
            <h4 class="rlist-item__title">{{ event.displayTitle }}</h4>
            <div class="rlist-item__when">
              <span class="rlist-item__time">{{ formatEventTime(event) }}</span>
            </div>
          </div>
          <span class="rlist-item__tag">{{ categoryLabel(getEventCategory(event)) }}</span>
          <p
            v-if="event.description"
            class="rlist-item__desc"
            v-html="cleanDescription(event.description)"
          ></p>
          <div v-if="event.location || event.requiresRegistration" class="rlist-item__meta">
            <span v-if="event.location" class="rlist-item__loc">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              {{ event.location }}
            </span>
            <a
              v-if="event.requiresRegistration && event.registrationUrl"
              :href="event.registrationUrl"
              target="_blank"
              rel="noopener"
              class="rlist-item__register"
              @click.stop
            >
              Register{{ event.registrationCost ? ' · ' + event.registrationCost : '' }} →
            </a>
            <span
              v-else-if="event.requiresRegistration"
              class="rlist-item__register rlist-item__register--info"
            >
              Registration required{{ event.registrationCost ? ' · ' + event.registrationCost : '' }}
            </span>
          </div>
        </li>
      </ul>
    </div>

    <!-- Recurring Events — side-scroll cards, after the calendar -->
    <section v-if="!loading && recurringEntries.length > 0" class="cal-section content-constrained">
      <div class="cal-section__head">
        <h2 class="cal-section__title">Recurring Events</h2>
      </div>
      <EventCarousel
        :entries="recurringEntries"
        layout="grid"
        hide-tag
        @select="openEventModal"
      />
    </section>

    <!-- Calendar export — two-button hierarchy: primary (Google) + secondary (iCal).
         The standalone "Open in Google Calendar" link was dropped since the
         primary "Add" action already takes you to Google Calendar to confirm. -->
    <div v-if="!loading" class="subscribe-links content-constrained">
      <a
        :href="googleCalendarUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="subscribe-link subscribe-link--primary"
      >
        <svg class="subscribe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M3 9h18M8 2v4M16 2v4" />
        </svg>
        Add to Google Calendar
      </a>
      <a :href="icalUrl" class="subscribe-link subscribe-link--secondary">
        <svg class="subscribe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M3 9h18M8 2v4M16 2v4" />
        </svg>
        Subscribe via iCal
      </a>
    </div>

    <EventModal
      :visible="modalVisible"
      :event="selectedEvent"
      @close="closeEventModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, addDays, subDays, isToday, startOfDay, endOfDay } from 'date-fns'
import EventModal from '../events/EventModal.vue'
import EventCarousel, { type CarouselEntry } from '../events/EventCarousel.vue'
import EventIcon from '../events/EventIcon.vue'
import { categorize, categoryLabel, categoryIcon, type EventCategory } from '../../utils/eventCategory'
import { findKnownEvent } from '../../utils/knownEvents'
import { CalendarService, type CalendarEvent } from '../../services/calendarService'
import { config } from '../../config'

const encodedCalendarId = encodeURIComponent(config.calendarId)
const icalUrl = `https://calendar.google.com/calendar/ical/${encodedCalendarId}/public/basic.ics`
const googleCalendarUrl = `https://calendar.google.com/calendar/render?cid=${encodedCalendarId}`

// Always start at the current month. Every mainstream calendar (Google,
// Apple, Outlook, FullCalendar.js) does this — users expect today to be
// visible and highlighted. The "what's next" surface is the Upcoming Events
// carousel above; the calendar itself is for orienting around today.
const currentDate = ref(new Date())
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
  // If user clicked a leading/trailing day (visible in this grid but from
  // an adjacent month), navigate the view to that month. Matches Google
  // Calendar / Apple Calendar / etc. — clicking is also a navigation gesture.
  if (!isSameMonth(day.date, currentDate.value)) {
    currentDate.value = day.date
    loadEvents()
  }
  // Otherwise stay in month mode; the day-view companion list below the
  // grid updates. Use the Day toggle for the focused day-only view.
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

// Set of recurring titles (lowercase) for fast category lookup against any event
// shown in the month grid. Built from futureEvents so it follows recurrence
// over a wider horizon than just the visible month.
const recurringTitles = computed(() => new Set(
  recurringEvents.value.map(r => r.title.toLowerCase())
))

// Category lookup uses the shared util in src/utils/eventCategory.ts.
// Wrapped here so call sites don't have to pass recurringTitles every time.
const getEventCategory = (event: CalendarEvent): EventCategory =>
  categorize(event, recurringTitles.value)

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

// Pick the icon for an event: known-events registry first, then the
// category's fallback icon. Used by carousels, day-view list, and mobile dots.
const iconForEvent = (event: CalendarEvent): string => {
  const known = findKnownEvent(event.title)
  return known?.icon ?? categoryIcon(getEventCategory(event))
}

// Build a CarouselEntry from an event. Color comes from category; the icon
// (from the known-events registry, falling back to the category icon) is what
// visually distinguishes one event from another within the same category.
const buildEntry = (
  event: CalendarEvent,
  options: { key: string; dateLabel: string }
): CarouselEntry => ({
  key: options.key,
  title: event.displayTitle || event.title,
  dateLabel: options.dateLabel,
  timeLabel: event.isAllDay ? 'All day' : formatEventTimeShort(event),
  category: getEventCategory(event),
  event,
  icon: iconForEvent(event),
})

// Entries for the side-scroll carousels — derived once from the existing lists.
// Limited to 8 each so the rails feel scannable, not overwhelming.
const upcomingEntries = computed<CarouselEntry[]>(() =>
  oneTimeEvents.value.slice(0, 8).map(event =>
    buildEntry(event, {
      key: event.id,
      dateLabel: format(event.start, 'EEE MMM d'),
    })
  )
)

const recurringEntries = computed<CarouselEntry[]>(() =>
  recurringEvents.value.map(rec =>
    buildEntry(rec.event, {
      key: rec.title,
      dateLabel: `Next · ${format(rec.nextDate, 'MMM d')}`,
    })
  )
)

// ---------- Search (current month) ----------
const searchOpen = ref(false)
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)

const searchResults = computed<CalendarEvent[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return []
  // Dedupe by id and limit to a reasonable dropdown size.
  const seen = new Set<string>()
  const out: CalendarEvent[] = []
  for (const event of allEvents.value) {
    if (seen.has(event.id)) continue
    const hay = `${event.title} ${event.description || ''}`.toLowerCase()
    if (hay.includes(q)) {
      seen.add(event.id)
      out.push(event)
      if (out.length >= 8) break
    }
  }
  return out
})

const toggleSearch = async () => {
  searchOpen.value = !searchOpen.value
  if (searchOpen.value) {
    await nextTick()
    searchInputRef.value?.focus()
  } else {
    searchQuery.value = ''
  }
}

const closeSearch = () => {
  searchOpen.value = false
  searchQuery.value = ''
}

const onSearchSelect = (event: CalendarEvent) => {
  // Jump the calendar to the event's month if needed, then open the modal.
  if (!isSameMonth(event.start, currentDate.value)) {
    currentDate.value = event.start
    loadEvents()
  }
  selectedDay.value = startOfDay(event.start)
  closeSearch()
  openEventModal(event)
}

// Clear search when navigating months — results were keyed to that month's data.
watch(currentDate, () => {
  if (searchQuery.value) searchQuery.value = ''
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

const stripHtml = (html: string): string => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

// Description has already been sanitized by parseGoogleCalendarEvent (removes
// guestlist URLs, registration text, cost, and converts \n → <br>). We just
// ensure any anchor tags in user descriptions open in a new tab so they don't
// hijack the page.
const cleanDescription = (description: string): string => {
  if (!description) return ''
  return description.replace(/<a (?![^>]*target=)/gi, '<a target="_blank" rel="noopener" ')
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

// Selected day defaults to today so the day-agenda below the grid always has
// something to show on mobile; on desktop the agenda is hidden via CSS in
// month mode (see .day-view--companion).
const ensureSelectedDay = () => {
  const today = new Date()
  if (isSameMonth(today, currentDate.value)) {
    selectedDay.value = startOfDay(today)
  } else {
    selectedDay.value = startOfDay(startOfMonth(currentDate.value))
  }
}

watch(currentDate, () => {
  if (!selectedDay.value || !isSameMonth(selectedDay.value, currentDate.value)) {
    ensureSelectedDay()
  }
})

onMounted(() => {
  ensureSelectedDay()
  loadEvents()
})
</script>

<style scoped>
/* ============================================================
   FULL CALENDAR — GANTRY STYLES
   3 event categories detectable from data:
     • open      → title contains "open hours" / "member hours"
     • recurring → title appears in another future occurrence
     • other     → everything else (one-off events)
   REG badge overlay on any event with requiresRegistration.
   All colors flow through theme tokens (light + dark).
   ============================================================ */

.full-calendar {
  max-width: 100%;
  margin: 0 auto;
}

.content-constrained {
  max-width: var(--maxw);
  margin-left: auto;
  margin-right: auto;
  padding: 0 26px;
}

/* ---------- SECTIONS ---------- */
.cal-section,
.calendar-header {
  padding: 56px 0;
  border-top: 2px solid var(--steel-hi);
}

/* Calendar header gets extra top padding to clearly separate from the
   Upcoming Events carousel above it. */
.calendar-header { padding-top: 64px; }

.cal-section:first-child,
.calendar-header:first-child {
  border-top: none;
}

.cal-section__head {
  margin-bottom: 22px;
}

.cal-section__title,
.events-title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(26px, 3.8vw, 40px);
  text-transform: uppercase;
  letter-spacing: -0.01em;
  line-height: 0.95;
  margin: 8px 0 0;
  color: var(--color-text-primary);
  text-align: left;
}

.cal-eyebrow {
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent-text);
}

/* ---------- DAY-VIEW LIST (rlist) ----------
   Per-row category accents (border-left + tag color) carry the meaning so
   sections built from this list (just day view now; recurring moved to a
   carousel) don't need bespoke modifier classes. */
.rlist {
  list-style: none;
  margin: 0;
  padding: 0;
}

.rlist-item {
  padding: 16px 0 16px 14px;
  border-left: 4px solid var(--cat, var(--smoke));
  border-bottom: 1px dashed var(--steel);
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.rlist-item:last-child { border-bottom: none; }

.rlist-item:hover {
  background: color-mix(in srgb, var(--cat, var(--smoke)) 8%, transparent);
}

/* Category accents — mirror the EventCarousel mapping */
.rlist-item--class     { --cat: var(--hazard-deep); }
.rlist-item--open      { --cat: var(--hazard); }
.rlist-item--hack      { --cat: var(--rust); }
.rlist-item--group     { --cat: var(--info); }
.rlist-item--recurring { --cat: var(--live); }
.rlist-item--default   { --cat: var(--smoke); }

.rlist-item__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 16px;
}

.rlist-item__title {
  font-family: var(--font-ui);
  font-weight: 500;
  font-size: 15px;
  text-transform: none;
  letter-spacing: 0;
  color: var(--color-text-primary);
  line-height: 1.25;
  margin: 0;
}

.rlist-item__tag {
  align-self: flex-start;
  font-family: var(--font-ui);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 3px 6px;
  border: 1px solid var(--cat, var(--smoke));
  color: var(--cat, var(--smoke));
  line-height: 1.4;
  margin-top: 2px;
}

.rlist-item--class .rlist-item__tag {
  background: var(--hazard);
  color: var(--tape-dark);
  border-color: var(--hazard);
}

.rlist-item__when {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: lowercase;
}

.rlist-item__time {
  color: var(--smoke);
}

.rlist-item__desc {
  font-family: var(--font-body);
  font-size: 15px;
  line-height: var(--leading-relaxed);
  color: var(--ash);
  margin: 0;
  max-width: 80ch;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rlist-item__desc :deep(a) {
  color: var(--accent-text);
  border-bottom: 1px solid var(--hazard);
}

.rlist-item__desc :deep(a:hover) {
  color: var(--color-text-primary);
}

.rlist-item__desc :deep(br) {
  display: block;
  margin: 4px 0;
}

.rlist-item__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 2px;
}

.rlist-item__loc {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--smoke);
}

.rlist-item__loc svg {
  width: 11px;
  height: 11px;
  flex: none;
}

.rlist-item__register {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-text);
  border: 1px solid var(--hazard);
  padding: 6px 11px;
  text-decoration: none;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.rlist-item__register:hover {
  background: var(--hazard);
  color: var(--tape-dark);
}

.rlist-item__register--info {
  cursor: default;
  color: var(--ash);
  border-color: var(--steel-hi);
}

/* ---------- CALENDAR HEADER + CONTROLS ----------
   Single row layout: [Month/Day toggle] [← month →] [search]
   Wraps on narrow viewports. */
.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.monthnav {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  justify-content: center;
  min-width: 0;
}

/* ---------- HEADER SEARCH ----------
   Icon button. Clicking expands an inline input + dropdown results panel
   that filters the current month's events live. */
.header-search {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.search-toggle {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 2px solid var(--steel-hi);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: border-color var(--transition-fast), color var(--transition-fast);
}

.search-toggle:hover {
  border-color: var(--hazard);
  color: var(--accent-text);
}

.header-search--open .search-toggle {
  border-color: var(--hazard);
  color: var(--accent-text);
}

.search-toggle svg { width: 16px; height: 16px; }

.search-input {
  width: 220px;
  height: 40px;
  padding: 0 12px;
  background: var(--slab);
  border: 2px solid var(--steel-hi);
  color: var(--color-text-primary);
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.04em;
}

.search-input:focus {
  outline: none;
  border-color: var(--hazard);
}

.search-input::placeholder {
  color: var(--smoke);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11px;
}

.search-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  max-width: calc(100vw - 32px);
  background: var(--slab);
  border: 2px solid var(--steel-hi);
  box-shadow: var(--shadow);
  z-index: 20;
}

.search-results {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 320px;
  overflow-y: auto;
}

.search-result {
  padding: 10px 14px;
  border-bottom: 1px dashed var(--steel);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.search-result:last-child { border-bottom: none; }

.search-result:hover {
  background: color-mix(in srgb, var(--hazard) 12%, transparent);
}

.search-result__title {
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-result__meta {
  margin-top: 3px;
  font-family: var(--font-ui);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent-text);
}

.search-empty {
  padding: 16px 14px;
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--smoke);
  text-align: center;
}

/* Segmented Month/Day toggle */
.view-toggle {
  display: inline-flex;
  border: 2px solid var(--steel-hi);
  background: transparent;
}

.view-toggle-btn {
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 9px 22px;
  background: transparent;
  color: var(--ash);
  border: none;
  cursor: pointer;
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.view-toggle-btn:hover {
  color: var(--accent-text);
}

.view-toggle-btn.active {
  background: var(--hazard);
  color: var(--tape-dark);
}

.month-year {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(22px, 2.8vw, 30px);
  letter-spacing: -0.01em;
  line-height: 1;
  color: var(--color-text-primary);
  text-align: center;
  text-transform: none;
  text-shadow: none;
  margin: 0;
  white-space: nowrap;
}

.nav-button {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 2px solid var(--steel-hi);
  color: var(--color-text-primary);
  font-family: var(--font-ui);
  font-size: 18px;
  cursor: pointer;
  transition: border-color var(--transition-fast), color var(--transition-fast);
}

.nav-button:hover {
  border-color: var(--hazard);
  color: var(--accent-text);
}

/* ---------- LEGEND ---------- */
.cal-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 22px;
  justify-content: center;
  padding: 0 26px 22px;
}

.cal-legend__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--smoke);
}

.cal-legend__sw {
  display: inline-block;
  width: 18px;
  height: 12px;
  border-left: 3px solid var(--cev-accent, var(--hazard));
  background: color-mix(in srgb, var(--cev-accent, var(--hazard)) 16%, transparent);
}

.cal-legend__item--recurring .cal-legend__sw { --cev-accent: var(--live); }
.cal-legend__item--group     .cal-legend__sw { --cev-accent: var(--info); }
.cal-legend__item--hack      .cal-legend__sw { --cev-accent: var(--rust); }
.cal-legend__sw--ghost {
  border-left: 3px solid var(--hazard);
  background: transparent;
}
.cal-legend__sw--reg {
  width: auto;
  height: auto;
  border-left: none;
  background: var(--hazard);
  color: var(--tape-dark);
  font-family: var(--font-ui);
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 1px 4px;
  border: 1px solid var(--tape-dark);
}

/* ---------- LOADING + ERROR ---------- */
.calendar-loading,
.calendar-error {
  text-align: center;
  padding: 64px 26px;
  font-family: var(--font-ui);
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--smoke);
}

.calendar-error p {
  color: var(--fault);
  margin-bottom: 16px;
}

/* ---------- MONTH GRID ---------- */
/* .month-view wraps the grid in content-constrained so the calendar aligns
   with all the section content (eyebrow / title / legend / rail) above and
   below it. */
.month-view {
  padding-bottom: 26px;
}

.calendar-grid {
  display: grid;
  /* minmax(0, 1fr) — CRUCIAL: forces columns to share viewport evenly even when
     content min-content would otherwise push them wider. Without this, a long
     nowrap event title makes one column overflow and the whole grid (and page)
     gets a horizontal scrollbar. */
  grid-template-columns: repeat(7, minmax(0, 1fr));
  border: 2px solid var(--steel-hi);
  border-bottom: none;
  /* NB: do not set width: 100% — block default fills the parent content area,
     and the mobile @media negative-margin trick (below) extends it edge-to-edge
     properly. A fixed width:100% would pin the box to the parent's content
     width and create a visible right-side gap when negative margins shift it. */
}

.day-header {
  background: var(--tape-dark);
  color: var(--on-dark);
  padding: 11px 8px;
  text-align: center;
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  border-right: 1px solid rgba(236, 227, 211, 0.12);
  /* allow narrow columns; ellipsis if needed */
  min-width: 0;
  overflow: hidden;
}

.day-header:nth-child(7) {
  border-right: none;
}

.calendar-day {
  background: var(--slab);
  min-height: 110px;
  padding: 6px 6px 8px;
  /* Subtle inner grid lines — `--steel` (lighter than the outer `--steel-hi`
     frame). The mockup uses this two-tier approach so the outer frame reads
     as the calendar's containing edge and the inner lines just separate days
     without dominating. */
  border-right: 1px solid var(--steel);
  border-bottom: 1px solid var(--steel);
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  /* Belt-and-suspenders for the minmax fix — keep any rogue content from
     spilling outside the cell. */
  min-width: 0;
  overflow: hidden;
}

.calendar-day:nth-child(7n + 7) {
  border-right: none;
}

.calendar-day:hover {
  background: var(--slab-hi);
}

.calendar-day.other-month {
  background: var(--grime);
}

.calendar-day.other-month .day-number {
  color: var(--smoke);
}

.calendar-day.today {
  background: var(--hazard-dim);
  border-top: 3px solid var(--hazard);
  margin-top: -2px;
}

.calendar-day.today .day-number {
  color: var(--accent-text);
}

/* Selected day — drawn as a hazard inset border so it works on both today
   and non-today cells without fighting the today bg. */
.calendar-day.selected::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 2px solid var(--hazard);
  pointer-events: none;
}
.calendar-day.selected .day-number {
  color: var(--accent-text);
}

.day-number {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 14px;
  line-height: 1;
  color: var(--color-text-primary);
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.day-events {
  flex: 1;
  display: flex;
  min-width: 0;
}

.day-events--chips {
  flex-direction: column;
  gap: 3px;
}

/* Mobile icons: small category-tinted glyphs in a wrapping flex row.
   One per event; replaces the old plain colored-dot pattern. */
.day-events--icons {
  display: none; /* visible only on mobile via media query */
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;
  align-content: flex-start;
  justify-content: center;
  margin-top: 4px;
}

.day-glyph {
  width: 11px;
  height: 11px;
  flex: 0 0 11px;
  color: var(--cev-accent, var(--smoke));
}

.day-glyph--class     { color: var(--hazard); }
.day-glyph--open      { color: var(--hazard); opacity: 0.7; }
.day-glyph--hack      { color: var(--rust); }
.day-glyph--group     { color: var(--info); }
.day-glyph--recurring { color: var(--live); }
.day-glyph--default   { color: var(--smoke); }

/* ---------- EVENT CHIPS ---------- */
.event-dot {
  position: relative;
  display: block;
  padding: 4px 6px;
  border-left: 3px solid var(--cev-accent, var(--hazard));
  background: color-mix(in srgb, var(--cev-accent, var(--hazard)) 22%, transparent);
  cursor: pointer;
  transition: transform var(--transition-fast);
  /* Critical for cells with minmax(0, 1fr) — overflow:hidden on the chip
     means its min-content size collapses to 0, so it never widens its cell. */
  overflow: hidden;
  min-width: 0;
}

.event-dot:hover {
  transform: translateX(2px);
}

.event-dot .event-time-inline {
  display: block;
  font-family: var(--font-ui);
  font-size: 10px;
  letter-spacing: 0.02em;
  color: var(--smoke);
  line-height: 1.2;
}

.event-dot .event-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: var(--font-ui);
  font-size: 12px;
  line-height: 1.2;
  color: var(--color-text-primary);
  font-weight: 500;
  /* Break long unbreakable words (like URLs or run-on titles) instead of
     overflowing the chip. */
  overflow-wrap: anywhere;
  word-break: break-word;
}

.event-dot__reg {
  position: absolute;
  top: 3px;
  right: 4px;
  font-family: var(--font-ui);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--tape-dark);
  background: var(--hazard);
  border: 1px solid var(--tape-dark);
  padding: 0 3px;
  line-height: 1.4;
}

/* Category accents */
.event-dot--recurring { --cev-accent: var(--live); }
.event-dot--hack      { --cev-accent: var(--rust); }
.event-dot--group     { --cev-accent: var(--info); }

/* Default (uncategorized) — quiet neutral chip. We don't label these as
   "one-time" because we can't be sure: some may recur outside our 90-day
   detection window. So they get a calm steel-toned treatment and recede
   visually next to the colored categories. */
.event-dot--default {
  --cev-accent: var(--smoke);
  background: color-mix(in srgb, var(--smoke) 14%, transparent);
}
.event-dot--default .event-title { color: var(--color-text-primary); }
.event-dot--default .event-time-inline { color: var(--smoke); }

/* Open Hours — outline only, low opacity (the ambient "background" presence) */
.event-dot--open {
  background: transparent;
  border-left: 3px solid var(--hazard);
  opacity: 0.6;
}
.event-dot--open .event-title { color: var(--ash); }
.event-dot--open .event-time-inline { color: var(--smoke); }

/* Class — solid hazard fill, dark text, REG badge. Most prominent. */
.event-dot--class {
  background: var(--hazard);
  border-left: 3px solid var(--hazard-deep);
  /* When the chip itself is solid hazard, the absolute REG badge has its own
     border but blends in. Tweak the badge's background to give contrast. */
  padding-right: 38px;
}
.event-dot--class .event-title {
  color: var(--tape-dark);
  font-weight: 600;
}
.event-dot--class .event-time-inline {
  color: rgba(20, 17, 13, 0.7);
}
.event-dot--class .event-dot__reg {
  background: var(--tape-dark);
  color: var(--hazard);
  border-color: var(--tape-dark);
}

/* All-day events: stronger fill */
.event-dot--all-day {
  background: color-mix(in srgb, var(--cev-accent, var(--hazard)) 35%, transparent);
}

.more-events {
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-text);
  padding: 3px 7px;
  cursor: pointer;
  display: inline-block;
  margin-top: 2px;
}

.more-events:hover {
  color: var(--color-text-primary);
}

/* ---------- DAY VIEW ---------- */
/* Used in both modes:
    • Day mode — the whole view; grid is hidden.
    • Month mode — acts as a companion list under the grid (.--companion).
   Reuses .rlist styles for items; only the wrapper + header are unique here. */
.day-view {
  padding-bottom: 26px;
}

.day-view--companion {
  padding-top: 18px;
  padding-bottom: 48px;
}

.day-view__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 2px solid var(--steel-hi);
  padding-bottom: 8px;
  margin-bottom: 8px;
  gap: 14px;
}

.day-view__date {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: -0.005em;
  color: var(--color-text-primary);
}

.day-view__count {
  font-family: var(--font-ui);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--smoke);
}

.day-view-empty {
  text-align: center;
  padding: 24px 0;
  color: var(--smoke);
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ---------- CALENDAR EXPORT BUTTONS ----------
   Two-button hierarchy: primary (Google, hazard fill) + secondary (iCal, outline).
   Stack vertically on mobile (full-width per the mockup), inline on desktop.
   Big top padding gives clear breathing room from the Recurring section above. */
.subscribe-links {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 56px 0 24px;
}

.subscribe-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 13px 22px;
  border: 2px solid var(--tape-dark);
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.subscribe-link--primary {
  background: var(--hazard);
  color: var(--tape-dark);
  box-shadow: var(--shadow-sm);
}

.subscribe-link--primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow);
}

.subscribe-link--primary:active {
  transform: translate(0, 0);
  box-shadow: var(--shadow-sm);
}

.subscribe-link--secondary {
  background: transparent;
  color: var(--color-text-primary);
  border-color: var(--steel-hi);
  box-shadow: none;
}

.subscribe-link--secondary:hover {
  border-color: var(--hazard);
  color: var(--accent-text);
  transform: translateY(-2px);
}

.subscribe-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .subscribe-links {
    flex-direction: column;
    padding: 24px 0 20px;
  }
  .subscribe-link {
    width: 100%;
    padding: 14px 16px;
  }
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 820px) {
  .cal-section,
  .calendar-header { padding: 36px 0 44px; }

  .cal-section__title { font-size: clamp(22px, 5vw, 30px); }

  .monthnav { gap: 10px; }
  .nav-button { width: 40px; height: 40px; font-size: 16px; }
  .month-year { font-size: clamp(20px, 4vw, 26px); }

  .calendar-day { min-height: 92px; padding: 5px; }
  .day-header { font-size: 10px; letter-spacing: 0.12em; padding: 9px 2px; }
  .day-number { font-size: 13px; }
  .event-dot { padding: 3px 5px; }
  .event-dot .event-title { font-size: 11px; -webkit-line-clamp: 2; }
  .event-dot .event-time-inline { font-size: 9px; }
  .event-dot--class { padding-right: 30px; }
  .event-dot__reg { font-size: 7px; padding: 0 2px; top: 2px; right: 3px; }

}

/* ---------- MOBILE ----------
   At ≤600px the grid switches to dots-only cells with a square aspect ratio,
   and the day-view companion becomes the primary read-the-events surface.
   The desktop chip layout would be unreadable at this scale. */
@media (max-width: 600px) {
  .content-constrained { padding: 0 16px; }

  /* Header search becomes compact-icon-only until expanded */
  .search-input { width: 100%; }
  .header-search--open { flex: 1; min-width: 0; }
  .search-panel { left: 0; right: auto; width: 100%; }

  /* Hide the chip layout, show the icon row */
  .day-events--chips { display: none; }
  .day-events--icons { display: flex; }

  /* Square cells with day number top-center + dots below */
  .calendar-day {
    aspect-ratio: 1 / 1;
    min-height: 0;
    padding: 5px 4px;
    align-items: center;
    justify-content: flex-start;
  }
  .day-header { font-size: 9px; padding: 7px 1px; letter-spacing: 0.08em; }
  .day-number { font-size: 13px; margin-bottom: 0; text-align: center; }

  .calendar-day.today { margin-top: 0; }

  /* Grid extends edge-to-edge on narrow screens */
  .calendar-grid {
    margin-left: -16px;
    margin-right: -16px;
    border-left: none;
    border-right: none;
  }

  /* In month mode, the companion day-view list IS the event-detail surface.
     Bigger bottom padding makes a clear visual break before the Recurring
     Events section that follows. */
  .day-view--companion { padding-top: 22px; padding-bottom: 64px; }

  /* RList item tweaks */
  .rlist-item { padding: 14px 0 14px 12px; gap: 4px; }
  .rlist-item__title { font-size: 14px; }
  .rlist-item__desc { font-size: 13px; -webkit-line-clamp: 3; }
  .rlist-item__when { gap: 8px; font-size: 10px; }

  .nav-button { width: 36px; height: 36px; font-size: 14px; }
  .search-toggle { width: 36px; height: 36px; }
  .monthnav { gap: 8px; }
}

@media (max-width: 380px) {
  .day-header { font-size: 8px; padding: 6px 1px; letter-spacing: 0.06em; }
  .day-number { font-size: 11px; }
  .day-dot { width: 5px; height: 5px; flex-basis: 5px; }

  .rlist-item { padding: 12px 0 12px 10px; }
  .rlist-item__title { font-size: 13px; }
}

/* Desktop-only: hide the day-view companion below the grid (in month mode).
   On desktop the chips in the grid carry enough info; the companion would
   be redundant. Day mode still shows the full day-view since
   .day-view--companion isn't applied there. */
@media (min-width: 601px) {
  .day-view--companion {
    /* Show as a slim "today's events" summary on tablet+. Hide entirely on wide
       desktops where the chip grid is dense enough. */
    max-width: var(--maxw);
  }
}
</style>
