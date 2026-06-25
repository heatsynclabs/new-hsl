<template>
  <div class="kiosk" :data-scene="current.key">
    <!-- Persistent overlays -->
    <div class="kiosk__clock">
      <span class="kiosk__time">{{ clock }}</span>
      <span class="kiosk__day">{{ today }}</span>
    </div>

    <div class="kiosk__brandmark">
      <img src="/hsl-logo.png" alt="" class="kiosk__brandmark-img klogo--light" />
      <img src="/hsl-logo-dark.png" alt="" class="kiosk__brandmark-img klogo--dark" />
      <span>heatsynclabs.org</span>
    </div>

    <div class="kiosk__dots" role="presentation">
      <span
        v-for="(s, i) in scenes"
        :key="s.key"
        class="kiosk__dot"
        :class="{ active: i === sceneIndex }"
      ></span>
    </div>

    <!-- Hover controls -->
    <div class="kiosk__controls" :class="{ show: controlsVisible }">
      <div class="kiosk__theme" role="group" aria-label="Theme">
        <button
          type="button"
          class="kiosk__theme-btn"
          :class="{ active: theme === 'light' }"
          :aria-pressed="theme === 'light'"
          @click="setTheme('light')"
        >Light</button>
        <button
          type="button"
          class="kiosk__theme-btn"
          :class="{ active: theme === 'dark' }"
          :aria-pressed="theme === 'dark'"
          @click="setTheme('dark')"
        >Dark</button>
      </div>
      <button type="button" class="kiosk__ctrl" @click="toggleFullscreen">
        {{ isFullscreen ? 'Exit fullscreen' : 'Fullscreen' }}
      </button>
      <a href="/calendar" class="kiosk__ctrl">Exit kiosk</a>
    </div>

    <!-- Scenes -->
    <transition name="kfade">
      <!-- CALENDAR -->
      <section v-if="current.key === 'calendar'" key="calendar" class="scene scene--calendar">
        <header class="scene__head scene__head--cal">
          <h1 class="scene__title scene__title--cal">{{ monthLabel }}</h1>
        </header>
        <div
          class="kcal"
          :style="{ gridTemplateRows: `min-content repeat(${weekCount}, minmax(0, 1fr))` }"
        >
          <div v-for="d in dayHeaders" :key="d" class="kcal__dh">{{ d }}</div>
          <div
            v-for="day in calendarDays"
            :key="day.date.getTime()"
            class="kcal__cell"
            :class="{ 'is-other': !day.isCurrentMonth, 'is-today': day.isToday }"
          >
            <span class="kcal__num">{{ day.date.getDate() }}</span>
            <div class="kcal__events">
              <div
                v-for="ev in day.events"
                :key="ev.id"
                class="kcal__chip"
                :class="`kcal__chip--${categoryOf(ev)}`"
              >
                <span v-if="ev.requiresRegistration" class="kcal__chip-reg">REG</span>
                <span class="kcal__chip-txt"><span
                  v-if="!ev.isAllDay && categoryOf(ev) !== 'open'"
                  class="kcal__chip-time"
                >{{ compactTime(ev) }}</span>{{ ev.displayTitle || ev.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- UPCOMING -->
      <section v-else-if="current.key === 'upcoming'" key="upcoming" class="scene scene--list">
        <header class="scene__head">
          <span class="scene__eyebrow">Coming up</span>
          <h1 class="scene__title">Upcoming Events</h1>
        </header>
        <ul class="klist">
          <li v-for="e in upcomingList" :key="e.id" class="klist__row" :class="`klist__row--${categoryOf(e)}`">
            <div class="klist__when">
              <span class="klist__date">{{ longDate(e) }}</span>
              <span class="klist__time">{{ e.isAllDay ? 'All day' : timeRange(e) }}</span>
            </div>
            <div class="klist__body">
              <h2 class="klist__title">
                <EventIcon :name="iconOf(e)" class="klist__icon" />
                {{ e.displayTitle || e.title }}
              </h2>
              <span class="klist__tag">{{ tagOf(e) }}</span>
            </div>
            <div v-if="e.requiresRegistration" class="klist__reg">
              Register{{ e.registrationCost ? ' · ' + e.registrationCost : '' }}
            </div>
          </li>
        </ul>
      </section>

      <!-- RECURRING -->
      <section v-else-if="current.key === 'recurring'" key="recurring" class="scene scene--list">
        <header class="scene__head">
          <span class="scene__eyebrow">Every week & month</span>
          <h1 class="scene__title">Recurring Events</h1>
        </header>
        <ul class="kgrid">
          <li v-for="r in recurringList" :key="r.title" class="kgrid__card" :class="`kgrid__card--${categoryOf(r.event)}`">
            <h2 class="kgrid__title">
              <EventIcon :name="iconOf(r.event)" class="kgrid__icon" />
              {{ r.event.displayTitle || r.event.title }}
            </h2>
            <span class="kgrid__next">Next · {{ shortDate(r.nextDate) }}</span>
          </li>
        </ul>
      </section>

      <!-- PHOTOS -->
      <section v-else-if="current.key === 'photos'" key="photos" class="scene scene--photo">
        <transition name="kfade">
          <div :key="photo.src" class="scene__photo">
            <img :src="photo.src" :alt="photo.caption" class="scene__photo-img" />
            <span class="scene__photo-caption">{{ photo.caption }}</span>
          </div>
        </transition>
      </section>

      <!-- LOGO -->
      <section v-else-if="current.key === 'logo'" key="logo" class="scene scene--logo">
        <img src="/hsl-logo.png" alt="HeatSync Labs" class="scene__logo-mark klogo--light" />
        <img src="/hsl-logo-dark.png" alt="HeatSync Labs" class="scene__logo-mark klogo--dark" />
        <h1 class="scene__logo-word">HeatSync Labs</h1>
        <p class="scene__logo-tag">Arizona's original community hackerspace · Mesa, AZ</p>
      </section>

      <!-- QR CODES -->
      <section v-else key="qr" class="scene scene--qr">
        <header class="scene__head scene__head--qr">
          <span class="scene__eyebrow">Scan with your phone</span>
          <h1 class="scene__title">Get Involved</h1>
        </header>
        <div class="qr">
          <div class="qr__item">
            <div class="qr__frame">
              <img src="/kiosk/qr-website.svg" alt="QR code linking to heatsynclabs.org" class="qr__img" />
            </div>
            <span class="qr__label">Visit the site</span>
            <span class="qr__url">heatsynclabs.org</span>
          </div>
          <div class="qr__item">
            <div class="qr__frame">
              <img src="/kiosk/qr-donate.svg" alt="QR code to donate to HeatSync Labs" class="qr__img" />
            </div>
            <span class="qr__label">Donate</span>
            <span class="qr__url">Support the space</span>
          </div>
        </div>
      </section>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, startOfDay,
} from 'date-fns'
import EventIcon from '../events/EventIcon.vue'
import { categorize, categoryLabel, categoryIcon, type EventCategory } from '../../utils/eventCategory'
import { findKnownEvent } from '../../utils/knownEvents'
import { CalendarService, type CalendarEvent } from '../../services/calendarService'

// ---- scenes (durations in ms; calendar dwells longest) ----
const ALL_SCENES = [
  { key: 'calendar', ms: 32000 },
  { key: 'upcoming', ms: 18000 },
  { key: 'recurring', ms: 18000 },
  { key: 'photos', ms: 16000 },
  { key: 'logo', ms: 9000 },
  { key: 'qr', ms: 15000 },
] as const

const calendarService = new CalendarService()
// Reactive "now" so a kiosk left running for days/weeks stays current. It's
// advanced on every clock tick (and a day rollover triggers a data reload),
// so the month grid, the "today" highlight and the upcoming/recurring filters
// all track real time instead of freezing at page-load. Without this the screen
// drifts further behind every day it stays up.
const now = ref(new Date())

const monthEvents = ref<CalendarEvent[]>([])
const futureEvents = ref<CalendarEvent[]>([])

const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthLabel = computed(() => format(now.value, 'MMMM yyyy'))

// ---- calendar grid ----
const calendarDays = computed(() => {
  const ref0 = now.value
  const start = startOfWeek(startOfMonth(ref0))
  const end = endOfWeek(endOfMonth(ref0))
  return eachDayOfInterval({ start, end }).map(date => ({
    date,
    isCurrentMonth: isSameMonth(date, ref0),
    isToday: isSameDay(date, ref0),
    events: monthEvents.value.filter(ev => {
      const ds = startOfDay(date)
      return ds >= startOfDay(ev.start) && ds <= startOfDay(ev.end)
    }),
  }))
})
const weekCount = computed(() => Math.max(1, calendarDays.value.length / 7))

// An event is still "live" until it ends, so an in-progress event stays
// listed but anything finished drops off — even if a data refetch hasn't run
// yet. This is what stops the kiosk showing last week's events.
const isFutureOrLive = (ev: CalendarEvent, liveNow: number) => ev.end.getTime() >= liveNow

// ---- recurrence grouping (mirrors the calendar page) ----
const recurringList = computed(() => {
  const liveNow = now.value.getTime()
  const groups = futureEvents.value.reduce((acc, ev) => {
    const t = ev.title.toLowerCase()
    if (t.includes('open hours') || t.includes('member hours')) return acc
    ;(acc[t] ||= []).push(ev)
    return acc
  }, {} as Record<string, CalendarEvent[]>)
  return Object.values(groups)
    .filter(evs => evs.length > 1)
    .map(evs => {
      const sorted = evs.sort((a, b) => a.start.getTime() - b.start.getTime())
      // Surface the next occurrence that hasn't ended yet, not the earliest in
      // the (possibly stale) fetched window — otherwise "Next" shows a past date.
      const next = sorted.find(ev => isFutureOrLive(ev, liveNow)) ?? sorted[sorted.length - 1]!
      return { title: sorted[0]!.title, event: next, nextDate: next.start }
    })
    .filter(r => isFutureOrLive(r.event, liveNow))
    .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())
    .slice(0, 12)
})

const recurringTitles = computed(() => new Set(recurringList.value.map(r => r.title.toLowerCase())))

const upcomingList = computed(() => {
  const liveNow = now.value.getTime()
  const groups = futureEvents.value.reduce((acc, ev) => {
    ;(acc[ev.title.toLowerCase()] ||= []).push(ev)
    return acc
  }, {} as Record<string, CalendarEvent[]>)
  return Object.values(groups)
    .filter(evs => evs.length === 1)
    .map(evs => evs[0]!)
    .filter(ev => isFutureOrLive(ev, liveNow))
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 7)
})

const categoryOf = (ev: CalendarEvent): EventCategory => categorize(ev, recurringTitles.value)
const iconOf = (ev: CalendarEvent): string => findKnownEvent(ev.title)?.icon ?? categoryIcon(categoryOf(ev))
const tagOf = (ev: CalendarEvent): string => categoryLabel(categoryOf(ev))

// Compact start time for calendar chips: "7pm" on the hour, else "7:30pm".
const compactTime = (ev: CalendarEvent) =>
  format(ev.start, ev.start.getMinutes() === 0 ? 'ha' : 'h:mma').toLowerCase()
const timeRange = (ev: CalendarEvent) => `${format(ev.start, 'h:mm a')} – ${format(ev.end, 'h:mm a')}`
const longDate = (ev: CalendarEvent) => format(ev.start, 'EEE, MMM d')
const shortDate = (d: Date) => format(d, 'MMM d')

// ---- photos ----
const PHOTOS = [
  { src: '/space-pics/Main%20Hall.webp', caption: 'Main Hall' },
  { src: '/space-pics/Laser%20Cutters.webp', caption: 'Laser Cutters' },
  { src: '/space-pics/Machine%20Shop.webp', caption: 'Machine Shop' },
  { src: '/space-pics/Electronics.webp', caption: 'Electronics Bench' },
  { src: '/space-pics/3D%20Printing%20Station.webp', caption: '3D Printing Station' },
  { src: '/space-pics/Woodshop.webp', caption: 'Woodshop' },
]
const photoIndex = ref(0)
const photo = computed(() => PHOTOS[photoIndex.value % PHOTOS.length]!)
let photoTimer: ReturnType<typeof setInterval> | undefined

// ---- theme (light / dark) — also reflected in the URL (/kiosk/light|dark) ----
const theme = ref<'light' | 'dark'>('dark')
const setTheme = (t: 'light' | 'dark') => {
  theme.value = t
  document.documentElement.setAttribute('data-theme', t)
  try { history.replaceState(null, '', `/kiosk/${t}`) } catch { /* ignore */ }
}

// ---- scene rotation ----
// Skip data-driven scenes that have nothing to show (e.g. calendar API blocked
// off-domain). Calendar / photos / logo always render.
const scenes = computed(() => ALL_SCENES.filter(s => {
  if (s.key === 'upcoming') return upcomingList.value.length > 0
  if (s.key === 'recurring') return recurringList.value.length > 0
  return true
}))
const sceneIndex = ref(0)
const current = computed(() => scenes.value[sceneIndex.value % scenes.value.length] ?? ALL_SCENES[0])
let sceneTimer: ReturnType<typeof setTimeout> | undefined

const scheduleNext = () => {
  clearTimeout(sceneTimer)
  sceneTimer = setTimeout(() => {
    sceneIndex.value = (sceneIndex.value + 1) % scenes.value.length
    scheduleNext()
  }, current.value.ms)
}

// Manual scene navigation (arrow keys) — restarts the dwell timer.
const goToScene = (dir: number) => {
  const n = scenes.value.length
  sceneIndex.value = (sceneIndex.value + dir + n) % n
  revealControls()
  scheduleNext()
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); goToScene(1) }
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goToScene(-1) }
  else if (e.key === 'f' || e.key === 'F') toggleFullscreen()
  else if (e.key === 'l' || e.key === 'L') setTheme(theme.value === 'light' ? 'dark' : 'light')
}

// ---- clock ----
const clock = ref('')
const today = ref('')
let clockTimer: ReturnType<typeof setInterval> | undefined
const tick = () => {
  const d = new Date()
  clock.value = format(d, 'h:mm a')
  today.value = format(d, 'EEEE, MMMM d')
  // Advance reactive "now" so the grid/filters stay current. On a day rollover,
  // reload the month grid + events so the new day's data is fetched.
  const rolledOver = !isSameDay(d, now.value)
  now.value = d
  if (rolledOver) loadCalendar()
}

// ---- fullscreen + idle controls ----
const isFullscreen = ref(false)
const controlsVisible = ref(true)
let idleTimer: ReturnType<typeof setTimeout> | undefined

const toggleFullscreen = async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen()
    else await document.exitFullscreen()
  } catch { /* ignore */ }
}
const onFsChange = () => { isFullscreen.value = !!document.fullscreenElement }

const revealControls = () => {
  controlsVisible.value = true
  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => { controlsVisible.value = false }, 3000)
}

// Fetch the month grid + upcoming/recurring events for the current "now".
// Called on mount, on a day rollover, and on a periodic timer so a long-running
// screen keeps pulling fresh data instead of showing the day it booted.
const loadCalendar = async () => {
  try {
    const [month, future] = await Promise.all([
      calendarService.getEventsForMonth(now.value),
      calendarService.getRecurringEvents(120),
    ])
    monthEvents.value = month
    futureEvents.value = future
  } catch (e) {
    console.error('Kiosk: failed to load calendar', e)
  }
}

// Re-pull calendar data periodically (well past the service's 5-min cache TTL)
// so newly-added/edited events surface without a manual reload.
const DATA_REFRESH_MS = 30 * 60 * 1000
let dataTimer: ReturnType<typeof setInterval> | undefined

onMounted(async () => {
  // Sync the toggle to whatever theme the page bootstrapped with (set by the
  // inline script per route: /kiosk/light, /kiosk/dark, or default dark).
  theme.value = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
  tick()
  clockTimer = setInterval(tick, 10000)
  photoTimer = setInterval(() => { photoIndex.value++ }, 7500)
  dataTimer = setInterval(loadCalendar, DATA_REFRESH_MS)
  document.addEventListener('fullscreenchange', onFsChange)
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('mousemove', revealControls)
  revealControls()
  scheduleNext()

  await loadCalendar()
})

onBeforeUnmount(() => {
  clearTimeout(sceneTimer)
  clearTimeout(idleTimer)
  clearInterval(clockTimer)
  clearInterval(photoTimer)
  clearInterval(dataTimer)
  document.removeEventListener('fullscreenchange', onFsChange)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('mousemove', revealControls)
})
</script>

<style scoped>
.kiosk {
  position: fixed;
  inset: 0;
  background: var(--char);
  color: var(--bone);
  overflow: hidden;
  font-family: var(--font-body);
}

/* ---- persistent overlays ---- */
/* Clock — top-right, compact so it stays clear of the grid. */
.kiosk__clock {
  position: absolute;
  top: 2.2vh;
  right: clamp(20px, 3vw, 60px);
  z-index: 5;
  text-align: right;
  line-height: 1.05;
}
.kiosk__time {
  display: block;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(16px, 1.8vw, 30px);
  letter-spacing: -0.01em;
  color: var(--bone);
}
.kiosk__day {
  font-family: var(--font-ui);
  font-size: clamp(8px, 0.72vw, 12px);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ash);
  margin-top: 2px;
}

/* Brand — small logo + wordmark, centered above the calendar. */
.kiosk__brandmark {
  position: absolute;
  top: 2.2vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font-ui);
  font-size: clamp(9px, 0.78vw, 13px);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ash);
}
.kiosk__brandmark-img { height: clamp(22px, 2vw, 34px); width: auto; }

/* Logo variants swap with the theme (dark-bg logo on dark, ink logo on light) */
.klogo--dark { display: none; }
:global([data-theme='dark']) .klogo--light { display: none; }
:global([data-theme='dark']) .klogo--dark { display: block; }

/* Scene dots — small, seated just under the calendar. */
.kiosk__dots {
  position: absolute;
  bottom: 1.7vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  display: flex;
  gap: 8px;
}
.kiosk__dot {
  width: clamp(6px, 0.5vw, 9px);
  height: clamp(6px, 0.5vw, 9px);
  border-radius: var(--radius-full);
  background: var(--steel-hi);
  transition: background-color var(--transition-base), transform var(--transition-base);
}
.kiosk__dot.active { background: var(--hazard); transform: scale(1.3); }

.kiosk__controls {
  position: absolute;
  bottom: 3vh;
  right: 3.2vh;
  z-index: 6;
  display: flex;
  gap: 12px;
  opacity: 0;
  transition: opacity var(--transition-base);
}
.kiosk__controls.show { opacity: 1; }
.kiosk__ctrl {
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--bone);
  background: var(--slab);
  border: 2px solid var(--steel-hi);
  padding: 8px 14px;
  text-decoration: none;
  cursor: pointer;
}
.kiosk__ctrl:hover { border-color: var(--hazard); color: var(--accent-text); }

/* Light / dark segmented selector */
.kiosk__theme {
  display: inline-flex;
  border: 2px solid var(--steel-hi);
  background: var(--slab);
}
.kiosk__theme-btn {
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ash);
  background: transparent;
  border: none;
  padding: 8px 14px;
  cursor: pointer;
  transition: color var(--transition-fast), background-color var(--transition-fast);
}
.kiosk__theme-btn:hover { color: var(--bone); }
.kiosk__theme-btn.active { background: var(--hazard); color: var(--tape-dark); }

/* ---- scene shell ---- */
.scene {
  position: absolute;
  inset: 0;
  /* Opaque so a fading-in scene never reveals empty background between scenes. */
  background: var(--char);
  padding: clamp(28px, 4vh, 64px) clamp(28px, 4vw, 80px);
  display: flex;
  flex-direction: column;
}
.scene__head { margin-bottom: clamp(14px, 2.2vh, 34px); }
.scene__eyebrow {
  display: block;
  font-family: var(--font-ui);
  font-size: clamp(12px, 1.1vw, 18px);
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent-text);
}
.scene__title {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(34px, 5.4vw, 92px);
  text-transform: uppercase;
  letter-spacing: -0.015em;
  line-height: 0.92;
  color: var(--bone);
  margin: 6px 0 0;
}

/* ---- calendar scene ----
   Sizing is driven by min(vh, vw) so type scales to the SHORTER axis — the one
   that actually constrains how many rows fit. This reads large on a tall 4K TV
   yet still fits a short projector or laptop. minmax(0,1fr) rows guarantee the
   grid never overflows the viewport. Every event renders (no "+N more"); chips
   flex-shrink so a busy day compacts them rather than hiding events, and Open
   Hours is drawn compact since it's ambient filler. */
.scene--calendar {
  padding-top: clamp(12px, 1.8vh, 32px);
  /* room at the bottom for the dots to seat under the grid */
  padding-bottom: clamp(28px, 3.8vh, 58px);
  padding-left: clamp(18px, 2.4vw, 56px);
  padding-right: clamp(18px, 2.4vw, 56px);
}
.scene__head--cal {
  display: flex;
  align-items: baseline;
  gap: 4px 18px;
  margin-bottom: clamp(6px, 1vh, 14px);
}
.scene__title--cal {
  font-size: clamp(22px, min(4.2vh, 3vw), 56px);
  margin: 0;
}
.kcal {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 1px;
  background: var(--steel-hi);
  border: 2px solid var(--steel-hi);
  min-height: 0;
}
.kcal__dh {
  background: var(--tape-dark);
  color: var(--on-dark);
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: clamp(10px, min(1.35vh, 1vw), 20px);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-align: center;
  padding: clamp(3px, 0.7vh, 12px) 2px;
  overflow: hidden;
}
.kcal__cell {
  background: var(--slab);
  min-height: 0;
  min-width: 0;
  padding: clamp(2px, 0.5vh, 9px) clamp(3px, 0.4vw, 8px);
  display: flex;
  flex-direction: column;
  gap: clamp(2px, 0.4vh, 5px);
  overflow: hidden;
}
.kcal__cell.is-other { background: var(--grime); }
.kcal__cell.is-other .kcal__num { color: var(--smoke); }
/* Today: opaque hazard tint (a translucent tint would let the dark gridline
   background bleed through in light mode). */
.kcal__cell.is-today { background: color-mix(in srgb, var(--hazard) 16%, var(--slab)); box-shadow: inset 0 0.3vh 0 var(--hazard); }
.kcal__cell.is-today .kcal__num { color: var(--accent-text); }
.kcal__num {
  flex: none;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(12px, min(1.9vh, 1.5vw), 30px);
  line-height: 1;
  color: var(--color-text-primary);
}
.kcal__events {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: clamp(2px, 0.4vh, 5px);
  min-height: 0;
  overflow: hidden;
}

/* Chips mirror /calendar's .event-dot: a compact time prefix + 2-line title.
   flex: 0 1 auto lets them shrink to share the cell when a day is busy, so
   every event stays visible instead of being dropped. */
.kcal__chip {
  position: relative;
  flex: 0 1 auto;
  min-height: 0;
  border-left: clamp(2px, 0.35vh, 4px) solid var(--cev, var(--hazard));
  background: color-mix(in srgb, var(--cev, var(--hazard)) 22%, transparent);
  padding: clamp(1px, 0.3vh, 5px) clamp(4px, 0.4vw, 8px);
  overflow: hidden;
  min-width: 0;
}
.kcal__chip-txt {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: var(--font-ui);
  font-size: clamp(10px, min(1.7vh, 1.35vw), 26px);
  font-weight: 500;
  line-height: 1.15;
  color: var(--color-text-primary);
  overflow-wrap: anywhere;
}
.kcal__chip-time {
  font-weight: 600;
  color: var(--smoke);
  margin-right: 0.4em;
}
.kcal__chip-reg {
  position: absolute;
  top: clamp(1px, 0.3vh, 4px);
  right: clamp(2px, 0.3vw, 5px);
  font-family: var(--font-ui);
  font-size: clamp(7px, min(0.95vh, 0.75vw), 13px);
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.4;
  color: var(--tape-dark);
  background: var(--hazard);
  border: 1px solid var(--tape-dark);
  padding: 0 0.3em;
}

.kcal__chip--hack       { --cev: var(--rust); }
.kcal__chip--group      { --cev: var(--info); }
.kcal__chip--recurring  { --cev: var(--live); }
.kcal__chip--default    { --cev: var(--smoke); background: color-mix(in srgb, var(--smoke) 14%, transparent); }

/* Open hours — compact single line, faded; it's ambient filler. */
.kcal__chip--open {
  --cev: var(--hazard);
  background: transparent;
  opacity: 0.7;
}
.kcal__chip--open .kcal__chip-txt { -webkit-line-clamp: 1; color: var(--ash); font-weight: 400; }

/* Class / registration — solid hazard block, dark text, REG badge */
.kcal__chip--class {
  --cev: var(--hazard-deep);
  background: var(--hazard);
  padding-right: clamp(22px, min(3vh, 2.2vw), 42px);
}
.kcal__chip--class .kcal__chip-txt { color: var(--tape-dark); font-weight: 600; }
.kcal__chip--class .kcal__chip-time { color: rgba(20, 17, 13, 0.65); }
.kcal__chip--class .kcal__chip-reg {
  background: var(--tape-dark);
  color: var(--hazard);
  border-color: var(--tape-dark);
}

/* ---- upcoming list scene ---- */
.scene--list { overflow: hidden; }
.klist { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: clamp(8px, 1.4vh, 18px); flex: 1; min-height: 0; }
.klist__row {
  display: grid;
  grid-template-columns: clamp(150px, 16vw, 280px) 1fr auto;
  align-items: center;
  gap: clamp(14px, 2vw, 40px);
  padding: clamp(10px, 1.6vh, 22px) clamp(14px, 1.6vw, 28px);
  background: var(--slab);
  border-left: 6px solid var(--cev, var(--smoke));
}
.klist__row--class      { --cev: var(--hazard); }
.klist__row--open       { --cev: var(--hazard); }
.klist__row--hack       { --cev: var(--rust); }
.klist__row--group      { --cev: var(--info); }
.klist__row--recurring  { --cev: var(--live); }
.klist__row--default    { --cev: var(--smoke); }
.klist__when { display: flex; flex-direction: column; gap: 3px; }
.klist__date {
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: clamp(15px, 1.5vw, 26px);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--accent-text);
}
.klist__time { font-family: var(--font-ui); font-size: clamp(12px, 1.1vw, 19px); color: var(--ash); }
.klist__body { min-width: 0; }
.klist__title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(18px, 2.1vw, 38px);
  text-transform: uppercase;
  letter-spacing: -0.01em;
  line-height: 1.04;
  color: var(--bone);
  margin: 0;
}
.klist__icon { width: 1em; height: 1em; flex-shrink: 0; color: var(--cev, var(--hazard)); }
.klist__tag {
  font-family: var(--font-ui);
  font-size: clamp(10px, 0.9vw, 15px);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ash);
}
.klist__reg {
  font-family: var(--font-ui);
  font-size: clamp(12px, 1.1vw, 18px);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--tape-dark);
  background: var(--hazard);
  padding: 8px 14px;
  white-space: nowrap;
}

/* ---- recurring grid scene ---- */
.kgrid {
  list-style: none; margin: 0; padding: 0; flex: 1; min-height: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(clamp(220px, 22vw, 360px), 1fr));
  grid-auto-rows: min-content;
  gap: clamp(12px, 1.6vw, 26px);
  align-content: start;
}
.kgrid__card {
  background: var(--slab);
  border: 2px solid var(--steel-hi);
  border-left: 6px solid var(--cev, var(--live));
  padding: clamp(14px, 1.8vh, 26px) clamp(16px, 1.4vw, 26px);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.kgrid__card--class { --cev: var(--hazard); }
.kgrid__card--hack { --cev: var(--rust); }
.kgrid__card--group { --cev: var(--info); }
.kgrid__card--recurring { --cev: var(--live); }
.kgrid__card--default { --cev: var(--smoke); }
.kgrid__title {
  display: flex; align-items: center; gap: 10px;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(16px, 1.6vw, 28px);
  text-transform: uppercase;
  letter-spacing: -0.005em;
  line-height: 1.05;
  color: var(--bone);
  margin: 0;
}
.kgrid__icon { width: 1em; height: 1em; flex-shrink: 0; color: var(--cev, var(--live)); }
.kgrid__next {
  font-family: var(--font-ui);
  font-size: clamp(11px, 1vw, 17px);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-text);
}

/* ---- photo scene ---- */
.scene--photo { padding: 0; }
.scene__photo { position: absolute; inset: 0; }
.scene__photo-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.scene__photo-caption {
  position: absolute;
  left: clamp(28px, 4vw, 80px);
  bottom: clamp(60px, 9vh, 120px);
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(28px, 4vw, 72px);
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: var(--on-dark);
  background: var(--tape-dark);
  padding: 6px 18px;
}

/* ---- logo scene ---- */
.scene--logo { align-items: center; justify-content: center; text-align: center; gap: clamp(16px, 2.5vh, 40px); }
.scene__logo-mark { width: clamp(140px, 22vw, 360px); height: auto; }
.scene__logo-word {
  font-family: var(--font-logo);
  font-weight: 700;
  font-size: clamp(48px, 9vw, 160px);
  line-height: 0.95;
  color: var(--bone);
  margin: 0;
}
.scene__logo-tag {
  font-family: var(--font-ui);
  font-size: clamp(13px, 1.4vw, 24px);
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ash);
  margin: 0;
}

/* ---- QR scene — two codes side by side ---- */
.scene--qr { align-items: center; justify-content: center; gap: clamp(20px, 4vh, 56px); }
.scene__head--qr { text-align: center; margin-bottom: 0; }
.qr {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: clamp(28px, 6vw, 130px);
}
.qr__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(10px, 1.6vh, 24px);
}
/* White frame doubles as the QR quiet zone so it scans on either theme. */
.qr__frame {
  background: #fff;
  padding: clamp(14px, 2.2vh, 34px);
  border: 2px solid var(--tape-dark);
  box-shadow: var(--shadow);
}
.qr__img {
  display: block;
  width: clamp(170px, min(36vh, 26vw), 520px);
  height: auto;
}
.qr__label {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(20px, min(3.6vh, 2.6vw), 50px);
  text-transform: uppercase;
  letter-spacing: -0.005em;
  line-height: 1;
  color: var(--bone);
}
.qr__url {
  font-family: var(--font-ui);
  font-size: clamp(12px, min(1.7vh, 1.3vw), 24px);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-text);
}

/* ---- transitions ----
   Simultaneous crossfade (no out-in gap). The entering scene sits on top with a
   solid background, so the screen is never blank between scenes. */
.kfade-enter-active { transition: opacity 0.6s ease; z-index: 2; }
.kfade-leave-active { transition: opacity 0.6s ease; z-index: 1; }
.kfade-enter-from, .kfade-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .kfade-enter-active, .kfade-leave-active { transition: opacity 0.2s ease; }
}
</style>
