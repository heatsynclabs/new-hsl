<template>
  <div class="event-page">
    <nav class="event-page__crumb">
      <a href="/calendar" class="event-page__back">← Back to calendar</a>
    </nav>

    <!-- Loading -->
    <div v-if="loading" class="event-page__state" aria-busy="true">
      <div class="skeleton skeleton--tag"></div>
      <div class="skeleton skeleton--title"></div>
      <div class="skeleton skeleton--line"></div>
      <div class="skeleton skeleton--line"></div>
      <p class="event-page__loading-text">Loading event…</p>
    </div>

    <!-- Error (network / API) -->
    <div v-else-if="error" class="event-page__state">
      <h1 class="event-page__msg-title">Could not load this event</h1>
      <p class="event-page__msg-body">
        Something went wrong reaching the calendar. It may be a temporary hiccup.
      </p>
      <div class="event-page__msg-actions">
        <button class="btn btn--primary" @click="load">Try again</button>
        <a class="btn btn--ghost" href="/calendar">Go to the calendar</a>
      </div>
    </div>

    <!-- Not found (bad/stale id or cancelled event) -->
    <div v-else-if="!event" class="event-page__state">
      <h1 class="event-page__msg-title">Event not found</h1>
      <p class="event-page__msg-body">
        This event may have been removed, or the link is incomplete. The full
        calendar has everything coming up.
      </p>
      <div class="event-page__msg-actions">
        <a class="btn btn--primary" href="/calendar">Browse the calendar</a>
      </div>
    </div>

    <!-- Event -->
    <article v-else class="event-page__card" :class="`cat--${category}`">
      <div class="event-page__head">
        <span class="event-page__tag">
          <EventIcon :name="eventIcon" class="event-page__tag-icon" />
          {{ tagLabel }}
        </span>
        <h1 class="event-page__title">{{ event.displayTitle || event.title }}</h1>
      </div>

      <div class="event-page__meta">
        <div class="event-page__meta-row">
          <svg class="event-page__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M3 10h18M8 2v4M16 2v4" />
          </svg>
          <span>{{ dateLabel }}</span>
        </div>
        <div class="event-page__meta-row">
          <svg class="event-page__meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{{ timeLabel }}</span>
        </div>
        <div v-if="event.location" class="event-page__meta-row">
          <svg class="event-page__meta-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span>{{ event.location }}</span>
        </div>
      </div>

      <a
        v-if="event.requiresRegistration && event.registrationUrl"
        :href="event.registrationUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="event-page__register"
      >
        Register for this event<span v-if="event.registrationCost"> · {{ event.registrationCost }}</span>
      </a>
      <div v-else-if="event.requiresRegistration" class="event-page__register event-page__register--info">
        Registration required<span v-if="event.registrationCost"> · {{ event.registrationCost }}</span>
      </div>

      <div v-if="event.description" class="event-page__desc">
        <h2 class="event-page__desc-head">Details</h2>
        <div v-html="safeDescription"></div>
      </div>

      <div class="event-page__actions">
        <a
          :href="googleUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn--primary"
        >
          <svg class="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M3 9h18M8 2v4M16 2v4" />
          </svg>
          Add to Google Calendar
        </a>
        <ShareButton :event="event" label="Copy link" />
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { format } from 'date-fns'
import EventIcon from './EventIcon.vue'
import ShareButton from './ShareButton.vue'
import { CalendarService, type CalendarEvent } from '../../services/calendarService'
import { categorize, categoryIcon, categoryLabel, type EventCategory } from '../../utils/eventCategory'
import { classifyClass, classTypeLabel } from '../../utils/classType'
import { findKnownEvent } from '../../utils/knownEvents'
import { eventIdFromLocation, googleCalendarTemplateUrl } from '../../utils/eventShare'

const calendarService = new CalendarService()

const loading = ref(true)
const error = ref(false)
const event = ref<CalendarEvent | null>(null)

// A recurring-instance id looks like `<base>_20261102T020000Z` or
// `<base>_R20260928T020000`. A single, non-recurring event's id has no such
// suffix. We can't recompute recurrence from one event, so this shape test is
// what lets the category read "Recurring" when nothing more specific matches.
const RECUR_INSTANCE_RE = /_R?\d{8}T\d{6}Z?$/

const category = computed<EventCategory>(() => {
  if (!event.value) return 'default'
  const recurringTitles = RECUR_INSTANCE_RE.test(event.value.id)
    ? new Set([event.value.title.toLowerCase()])
    : new Set<string>()
  return categorize(event.value, recurringTitles)
})

// Tag label: registration-bearing "class" events split into Class / Workshop /
// Certification, matching the rest of the calendar; everything else uses its
// category label.
const tagLabel = computed(() => {
  if (!event.value) return ''
  if (category.value === 'class') {
    return classTypeLabel(classifyClass(event.value.displayTitle || event.value.title, event.value.description || ''))
  }
  return categoryLabel(category.value)
})

const eventIcon = computed(() => {
  if (!event.value) return 'calendar'
  return findKnownEvent(event.value.title)?.icon ?? categoryIcon(category.value)
})

const dateLabel = computed(() =>
  event.value ? format(event.value.start, 'EEEE, MMMM d, yyyy') : ''
)

const timeLabel = computed(() => {
  if (!event.value) return ''
  if (event.value.isAllDay) return 'All day'
  return `${format(event.value.start, 'h:mm a')} – ${format(event.value.end, 'h:mm a')}`
})

const googleUrl = computed(() =>
  event.value ? googleCalendarTemplateUrl(event.value) : '#'
)

// Description is already sanitized by the service (guestlist/registration/cost
// stripped, newlines → <br>). Ensure any anchor opens in a new tab.
const safeDescription = computed(() =>
  (event.value?.description || '').replace(/<a (?![^>]*target=)/gi, '<a target="_blank" rel="noopener" ')
)

const load = async () => {
  loading.value = true
  error.value = false
  const id = eventIdFromLocation(typeof window !== 'undefined' ? window.location.search : '')
  if (!id) {
    event.value = null
    loading.value = false
    return
  }
  try {
    event.value = await calendarService.getEvent(id)
  } catch (err) {
    console.error('Failed to load event:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(load)

// Keep the browser tab title in step with the loaded event (nice when the link
// is opened fresh; link-preview unfurls can't be per-event on a static host).
watch(event, (e) => {
  if (typeof document === 'undefined') return
  document.title = e ? `${e.displayTitle || e.title} - HeatSync Labs` : 'Event - HeatSync Labs'
})
</script>

<style scoped>
.event-page {
  max-width: 760px;
  margin: 0 auto;
  padding: var(--space-8) 26px var(--space-16);
}

.event-page__crumb {
  margin-bottom: var(--space-6);
}

.event-page__back {
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: color var(--transition-base), border-color var(--transition-base);
}

.event-page__back:hover {
  color: var(--color-text-primary);
  border-color: var(--color-accent-primary);
}

/* ---------- Card ---------- */
.event-page__card {
  --cat: var(--smoke);
  background: var(--slab);
  border: 2px solid var(--steel-hi);
  border-left: 6px solid var(--cat);
  box-shadow: var(--shadow);
  padding: var(--space-8);
}

.cat--class     { --cat: var(--hazard); }
.cat--open      { --cat: var(--hazard); }
.cat--hack      { --cat: var(--rust); }
.cat--group     { --cat: var(--info); }
.cat--recurring { --cat: var(--live); }
.cat--default   { --cat: var(--smoke); }

.event-page__head {
  margin-bottom: var(--space-6);
}

.event-page__tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: 1px solid var(--cat);
  color: var(--cat);
  padding: 4px 9px;
  line-height: 1.4;
  margin-bottom: var(--space-4);
}

.cat--class .event-page__tag {
  background: var(--hazard);
  color: var(--tape-dark);
  border-color: var(--tape-dark);
}

.event-page__tag-icon {
  width: 14px;
  height: 14px;
}

.event-page__title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(28px, 5vw, 42px);
  line-height: 1.05;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  margin: 0;
  overflow-wrap: anywhere;
}

/* ---------- Meta ---------- */
.event-page__meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.event-page__meta-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  font-family: var(--font-sans);
}

.event-page__meta-icon {
  width: 20px;
  height: 20px;
  color: var(--cat);
  flex-shrink: 0;
}

/* ---------- Registration ---------- */
.event-page__register {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--color-accent-secondary);
  text-decoration: none;
  padding: var(--space-3) var(--space-4);
  background: var(--hazard-dim);
  border: 2px solid var(--color-accent-primary);
  margin-bottom: var(--space-6);
  transition: background var(--transition-base), color var(--transition-base);
}

a.event-page__register:hover {
  background: var(--color-accent-primary);
  color: var(--tape-dark);
}

.event-page__register--info {
  cursor: default;
}

/* ---------- Description ---------- */
.event-page__desc {
  border-top: 2px solid var(--steel-hi);
  padding-top: var(--space-6);
  margin-bottom: var(--space-8);
}

.event-page__desc-head {
  font-family: var(--font-ui);
  font-size: var(--text-lg);
  font-weight: 400;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-accent-secondary);
  margin: 0 0 var(--space-3);
}

.event-page__desc div {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  font-family: var(--font-sans);
}

.event-page__desc :deep(a) {
  color: var(--color-accent-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.event-page__desc :deep(a:hover) {
  color: var(--color-text-primary);
}

/* ---------- Actions ---------- */
.event-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: var(--space-3) var(--space-4);
  border: 2px solid transparent;
  cursor: pointer;
  text-decoration: none;
  line-height: 1.2;
  transition: background var(--transition-base), color var(--transition-base), border-color var(--transition-base), transform var(--transition-fast);
}

.btn--primary {
  background: var(--color-accent-primary);
  color: var(--tape-dark);
  border-color: var(--color-accent-primary);
}

.btn--primary:hover {
  transform: translate(-1px, -1px);
}

.btn--ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border-color: var(--color-border);
}

.btn--ghost:hover {
  color: var(--color-text-primary);
  border-color: var(--color-accent-primary);
}

.btn__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* ---------- States ---------- */
.event-page__state {
  background: var(--slab);
  border: 2px solid var(--steel-hi);
  box-shadow: var(--shadow-sm);
  padding: var(--space-8);
}

.event-page__msg-title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(22px, 4vw, 30px);
  text-transform: uppercase;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3);
}

.event-page__msg-body {
  color: var(--color-text-secondary);
  font-family: var(--font-sans);
  margin: 0 0 var(--space-6);
  line-height: var(--leading-relaxed);
}

.event-page__msg-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.event-page__loading-text {
  color: var(--color-text-tertiary);
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin: var(--space-4) 0 0;
}

/* Skeleton shimmer for the loading state */
.skeleton {
  background: color-mix(in srgb, var(--steel-hi) 40%, transparent);
  margin-bottom: var(--space-3);
  animation: skeleton-pulse 1.4s ease-in-out infinite;
}

.skeleton--tag   { width: 110px; height: 22px; }
.skeleton--title { width: 80%; height: 38px; margin-bottom: var(--space-5); }
.skeleton--line  { width: 100%; height: 14px; }

@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.9; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; }
}

@media (max-width: 600px) {
  .event-page {
    padding: var(--space-6) 18px var(--space-12);
  }
  .event-page__card,
  .event-page__state {
    padding: var(--space-6);
  }
  .event-page__meta-row {
    font-size: var(--text-base);
  }
}
</style>
