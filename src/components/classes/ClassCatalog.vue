<template>
  <section class="cat">
    <div class="cat__head">
      <h2 class="cat__title">Classes We Offer</h2>
      <p class="cat__sub">
        The kinds of classes and equipment certifications that run at HeatSync Labs.
        Watch the <a href="/calendar">calendar</a> for the next session, or
        <a href="/register">join the interest list</a> to be notified.
      </p>
    </div>

    <div class="cat__filter" role="tablist" aria-label="Filter classes">
      <button
        v-for="opt in filters"
        :key="opt.value"
        type="button"
        role="tab"
        :aria-selected="filter === opt.value"
        :class="['cat__filter-btn', { active: filter === opt.value }]"
        @click="setFilter(opt.value)"
      >
        {{ opt.label }}
        <span class="cat__filter-count">{{ opt.count }}</span>
      </button>
    </div>

    <ul class="cat__grid" role="list">
      <li
        v-for="item in visibleClasses"
        :key="item.slug"
        class="cat__card"
        :class="{ 'cat__card--cert': item.type === 'certification' }"
        @click="openModal(item)"
      >
        <div class="cat__media">
          <template v-if="item.photos.length">
            <img
              :src="item.photos[photoIdx(item)]"
              :alt="item.name"
              class="cat__img"
              loading="lazy"
            />
            <template v-if="item.photos.length > 1">
              <button
                type="button"
                class="cat__nav cat__nav--prev"
                aria-label="Previous photo"
                @click.stop="step(item, -1)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button
                type="button"
                class="cat__nav cat__nav--next"
                aria-label="Next photo"
                @click.stop="step(item, 1)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
              <div class="cat__dots">
                <span
                  v-for="(p, i) in item.photos"
                  :key="i"
                  class="cat__dot"
                  :class="{ active: i === photoIdx(item) }"
                ></span>
              </div>
            </template>
          </template>
          <div v-else class="cat__img cat__img--placeholder">
            <EventIcon :name="item.icon" class="cat__placeholder-icon" />
          </div>
          <span class="cat__badge">{{ item.type === 'certification' ? 'Certification' : 'Workshop' }}</span>
        </div>
        <div class="cat__body">
          <h3 class="cat__card-title">
            <EventIcon :name="item.icon" class="cat__card-icon" />
            <span>{{ item.name }}</span>
          </h3>
          <p class="cat__desc">{{ shortDesc(item.description) }}</p>
          <span class="cat__more">
            View details
            <span v-if="item.photos.length > 1" class="cat__more-count">· {{ item.photos.length }} photos</span>
            →
          </span>
        </div>
      </li>
    </ul>

    <div v-if="filtered.length > COLLAPSED" class="cat__loadmore">
      <button type="button" class="cat__loadmore-btn" @click="expanded = !expanded">
        {{ expanded ? 'Show fewer' : `Show all ${filtered.length} classes` }}
      </button>
    </div>

    <!-- Detail modal -->
    <div v-if="active" class="cmodal-overlay" @click="closeModal">
      <div class="cmodal" @click.stop>
        <button class="cmodal__close" aria-label="Close" @click="closeModal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18" /><path d="M6 6l12 12" />
          </svg>
        </button>

        <button
          v-if="active.photos.length"
          type="button"
          class="cmodal__hero"
          aria-label="Expand photo"
          @click="openLightbox(modalIdx)"
        >
          <img :src="active.photos[modalIdx]" :alt="active.name" class="cmodal__hero-img" />
          <span class="cmodal__expand">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
          </span>
        </button>

        <div class="cmodal__body">
          <span class="cmodal__badge">{{ active.type === 'certification' ? 'Certification' : 'Workshop' }}</span>
          <h2 class="cmodal__title">
            <EventIcon :name="active.icon" class="cmodal__title-icon" />
            <span>{{ active.name }}</span>
          </h2>
          <div class="cmodal__desc">
            <p v-for="(para, i) in paragraphs(active.description)" :key="i">{{ para }}</p>
          </div>

          <!-- Upcoming sessions — fuzzy-matched from the live calendar -->
          <div v-if="matchedSessions.length" class="cmodal__sessions">
            <span class="cmodal__sessions-label">Upcoming sessions</span>
            <ul class="cmodal__sessions-list">
              <li
                v-for="s in matchedSessions"
                :key="s.id"
                class="cmodal__session"
              >
                <div class="cmodal__session-when">
                  <span class="cmodal__session-date">{{ sessionDate(s) }}</span>
                  <span class="cmodal__session-time">{{ sessionTime(s) }}</span>
                </div>
                <a
                  v-if="s.registrationUrl"
                  :href="s.registrationUrl"
                  target="_blank"
                  rel="noopener"
                  class="cmodal__session-register"
                >Register{{ s.registrationCost ? ' · ' + s.registrationCost : '' }} →</a>
                <span v-else class="cmodal__session-register cmodal__session-register--info">
                  Registration required{{ s.registrationCost ? ' · ' + s.registrationCost : '' }}
                </span>
              </li>
            </ul>
          </div>

          <!-- Gallery — small thumbnails, expandable to a lightbox -->
          <div v-if="active.photos.length > 1" class="cmodal__gallery">
            <span class="cmodal__gallery-label">Photos</span>
            <div class="cmodal__thumbs">
              <button
                v-for="(photo, i) in active.photos"
                :key="i"
                type="button"
                class="cmodal__thumb"
                :class="{ active: i === modalIdx }"
                :aria-label="`Photo ${i + 1}`"
                @click="modalIdx = i"
                @dblclick="openLightbox(i)"
              >
                <img :src="photo" :alt="`${active.name} photo ${i + 1}`" loading="lazy" />
              </button>
            </div>
          </div>

          <div class="cmodal__actions">
            <a href="/register" class="cmodal__cta">Join the interest list →</a>
            <a href="/calendar" class="cmodal__cta cmodal__cta--ghost">See the calendar</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox — full-size, above the modal -->
    <div v-if="active && lightboxIdx !== null" class="lightbox" @click="lightboxIdx = null">
      <button class="lightbox__close" aria-label="Close" @click.stop="lightboxIdx = null">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>
      </button>
      <button
        v-if="active.photos.length > 1"
        class="lightbox__nav lightbox__nav--prev"
        aria-label="Previous"
        @click.stop="lightboxStep(-1)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <img :src="active.photos[lightboxIdx]" :alt="active.name" class="lightbox__img" @click.stop />
      <button
        v-if="active.photos.length > 1"
        class="lightbox__nav lightbox__nav--next"
        aria-label="Next"
        @click.stop="lightboxStep(1)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </button>
      <span class="lightbox__count">{{ lightboxIdx + 1 }} / {{ active.photos.length }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import EventIcon from '../events/EventIcon.vue'
import { CLASS_CATALOG, type ClassOffering } from '../../data/classCatalog'
import { CalendarService, type CalendarEvent } from '../../services/calendarService'

type Filter = 'all' | 'cert' | 'workshop'

const COLLAPSED = 8

const filter = ref<Filter>('all')
const expanded = ref(false)

const certCount = CLASS_CATALOG.filter(c => c.type === 'certification').length
const filters: { value: Filter; label: string; count: number }[] = [
  { value: 'all', label: 'All', count: CLASS_CATALOG.length },
  { value: 'cert', label: 'Certifications', count: certCount },
  { value: 'workshop', label: 'Workshops', count: CLASS_CATALOG.length - certCount },
]

const filtered = computed(() => {
  if (filter.value === 'cert') return CLASS_CATALOG.filter(c => c.type === 'certification')
  if (filter.value === 'workshop') return CLASS_CATALOG.filter(c => c.type !== 'certification')
  return CLASS_CATALOG
})

const visibleClasses = computed(() =>
  expanded.value ? filtered.value : filtered.value.slice(0, COLLAPSED)
)

const setFilter = (value: Filter) => {
  filter.value = value
  expanded.value = false
}

// ---- per-card photo carousel ----
const photoState = reactive<Record<string, number>>({})
const photoIdx = (item: ClassOffering) => photoState[item.slug] ?? 0
const step = (item: ClassOffering, dir: number) => {
  const n = item.photos.length
  if (n <= 1) return
  photoState[item.slug] = ((photoIdx(item) + dir) % n + n) % n
}

// ---- detail modal ----
const active = ref<ClassOffering | null>(null)
const modalIdx = ref(0)
const openModal = (item: ClassOffering) => {
  active.value = item
  modalIdx.value = 0
  lightboxIdx.value = null
}
const closeModal = () => {
  active.value = null
  lightboxIdx.value = null
}

// ---- lightbox ----
const lightboxIdx = ref<number | null>(null)
const openLightbox = (i: number) => { lightboxIdx.value = i }
const lightboxStep = (dir: number) => {
  if (!active.value || lightboxIdx.value === null) return
  const n = active.value.photos.length
  lightboxIdx.value = ((lightboxIdx.value + dir) % n + n) % n
}

const shortDesc = (desc: string): string => {
  const plain = desc.replace(/\s+/g, ' ').trim()
  if (plain.length <= 130) return plain
  return plain.substring(0, 127).trim() + '…'
}

const paragraphs = (desc: string): string[] =>
  desc.split(/\n{1,}/).map(p => p.trim()).filter(Boolean)

// ---- match catalog entries to upcoming calendar sessions ----
// The calendar titles don't match the catalog names exactly (e.g. catalog
// "Laser Certification Class" vs event "Laser Cutter Certification (Registration
// Required)"), so match on shared significant tokens after stripping the words
// that nearly every class title carries. Show the soonest few matches.
const STOPWORDS = new Set([
  'class', 'classes', 'certification', 'certifications', 'cert', 'certified',
  'intro', 'introduction', 'to', 'the', 'a', 'an', 'and', 'or', 'for', 'of',
  'basics', 'basic', 'workshop', 'workshops', 'your', 'heatsync', 'labs', 'lab',
  'registration', 'required', 'making', 'make', 'learn', 'use', 'using', 'with',
  'day', 'night', 'beginner', 'how',
])

const tokenize = (s: string): string[] =>
  s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t))

// overlap coefficient — shared tokens over the smaller token set
const similarity = (a: string[], b: string[]): number => {
  if (!a.length || !b.length) return 0
  const setB = new Set(b)
  let shared = 0
  for (const t of new Set(a)) if (setB.has(t)) shared++
  return shared / Math.min(new Set(a).size, setB.size)
}

interface UpcomingSession {
  event: CalendarEvent
  tokens: string[]
}

const sessions = ref<UpcomingSession[]>([])
const calendarService = new CalendarService()

onMounted(async () => {
  try {
    const all = await calendarService.getAllFutureEvents()
    sessions.value = all
      .filter(e => e.requiresRegistration)
      .map(e => ({ event: e, tokens: tokenize(e.displayTitle || e.title) }))
  } catch (e) {
    console.error('Failed to load upcoming sessions for matching:', e)
  }
})

const matchedSessions = computed<CalendarEvent[]>(() => {
  if (!active.value) return []
  const catTokens = tokenize(active.value.name)
  return sessions.value
    .map(s => ({ event: s.event, score: similarity(catTokens, s.tokens) }))
    .filter(s => s.score >= 0.5)
    .sort((a, b) => b.score - a.score || a.event.start.getTime() - b.event.start.getTime())
    .slice(0, 3)
    .map(s => s.event)
})

const sessionDate = (e: CalendarEvent): string => format(e.start, 'EEE MMM d')
const sessionTime = (e: CalendarEvent): string =>
  e.isAllDay ? 'All day' : `${format(e.start, 'h:mm a')} – ${format(e.end, 'h:mm a')}`
</script>

<style scoped>
.cat__head {
  margin-bottom: 20px;
}

.cat__title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(26px, 3.8vw, 40px);
  text-transform: uppercase;
  letter-spacing: -0.01em;
  line-height: 0.95;
  color: var(--color-text-primary);
  margin: 0;
}

.cat__sub {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--ash);
  line-height: var(--leading-relaxed);
  margin: 10px 0 0;
  max-width: 60ch;
}

.cat__sub a {
  color: var(--accent-text);
  border-bottom: 1px solid var(--hazard);
  text-decoration: none;
}

/* Segmented filter — mirrors the calendar's view-toggle DNA */
.cat__filter {
  display: inline-flex;
  flex-wrap: wrap;
  border: 2px solid var(--steel-hi);
  margin-bottom: 22px;
}

.cat__filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 9px 18px;
  background: transparent;
  color: var(--ash);
  border: none;
  border-right: 2px solid var(--steel-hi);
  cursor: pointer;
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.cat__filter-btn:last-child { border-right: none; }

.cat__filter-btn:hover { color: var(--accent-text); }

.cat__filter-btn.active {
  background: var(--hazard);
  color: var(--tape-dark);
}

.cat__filter-count {
  font-size: 10px;
  opacity: 0.7;
}

.cat__grid {
  list-style: none;
  margin: 0;
  padding: 4px 0 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.cat__card {
  background: var(--slab);
  border: 2px solid var(--steel-hi);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  overflow: hidden;
}

.cat__card:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow);
}

.cat__media {
  position: relative;
  aspect-ratio: 3 / 2;
  background: var(--grime);
  overflow: hidden;
}

.cat__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cat__img--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--steel-hi);
}

.cat__placeholder-icon {
  width: 48px;
  height: 48px;
}

/* Carousel arrows — unobtrusive: faint until the card is hovered */
.cat__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 17, 13, 0.55);
  color: var(--on-dark);
  border: none;
  cursor: pointer;
  opacity: 0;
  transition: opacity var(--transition-fast), background-color var(--transition-fast);
  z-index: 2;
}

.cat__media:hover .cat__nav { opacity: 1; }
.cat__nav:hover { background: var(--hazard); color: var(--tape-dark); }
.cat__nav svg { width: 15px; height: 15px; }
.cat__nav--prev { left: 6px; }
.cat__nav--next { right: 6px; }

.cat__dots {
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 5px;
  z-index: 2;
  pointer-events: none;
}

.cat__dot {
  width: 5px;
  height: 5px;
  border-radius: var(--radius-full);
  background: rgba(236, 227, 211, 0.55);
  box-shadow: 0 0 0 1px rgba(20, 17, 13, 0.35);
}

.cat__dot.active {
  background: var(--hazard);
}

.cat__badge {
  position: absolute;
  top: 10px;
  left: 10px;
  font-family: var(--font-ui);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 4px 8px;
  background: var(--tape-dark);
  color: var(--on-dark);
  border: 1px solid var(--tape-dark);
  z-index: 2;
}

.cat__card--cert .cat__badge {
  background: var(--hazard);
  color: var(--tape-dark);
}

.cat__body {
  padding: 13px 15px 15px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
}

.cat__card-title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 16px;
  line-height: 1.12;
  text-transform: uppercase;
  letter-spacing: -0.005em;
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.cat__card-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  color: var(--accent-text);
  margin-top: 2px;
}

.cat__desc {
  font-family: var(--font-body);
  font-size: 13.5px;
  line-height: var(--leading-relaxed);
  color: var(--ash);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cat__more {
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-text);
  margin-top: auto;
  padding-top: 4px;
}

.cat__more-count {
  color: var(--smoke);
  font-weight: 500;
}

/* Load more / fewer */
.cat__loadmore {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}

.cat__loadmore-btn {
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 13px 26px;
  background: transparent;
  color: var(--color-text-primary);
  border: 2px solid var(--steel-hi);
  cursor: pointer;
  transition: border-color var(--transition-fast), color var(--transition-fast);
}

.cat__loadmore-btn:hover {
  border-color: var(--hazard);
  color: var(--accent-text);
}

/* ---------- DETAIL MODAL ---------- */
.cmodal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-4);
}

.cmodal {
  background: var(--color-bg-secondary);
  border: var(--bd-2);
  max-width: 640px;
  width: 100%;
  max-height: 88vh;
  overflow-y: auto;
  position: relative;
}

.cmodal__close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--tape-dark);
  border: none;
  color: var(--on-dark);
  cursor: pointer;
  z-index: 3;
}

.cmodal__close svg { width: 20px; height: 20px; }

.cmodal__hero {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  border-bottom: 2px solid var(--steel-hi);
  background: var(--grime);
  cursor: zoom-in;
  position: relative;
}

.cmodal__hero-img {
  width: 100%;
  max-height: 340px;
  object-fit: cover;
  display: block;
}

.cmodal__expand {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 17, 13, 0.6);
  color: var(--on-dark);
}

.cmodal__expand svg { width: 16px; height: 16px; }

.cmodal__body {
  padding: var(--space-6) var(--space-8) var(--space-8);
}

.cmodal__badge {
  display: inline-block;
  font-family: var(--font-ui);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 4px 9px;
  background: var(--hazard);
  color: var(--tape-dark);
  margin-bottom: 14px;
}

.cmodal__title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(24px, 4vw, 32px);
  line-height: 1.05;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  margin: 0 0 18px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.cmodal__title-icon {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  color: var(--accent-text);
  margin-top: 3px;
}

.cmodal__desc p {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--color-text-secondary);
  margin: 0 0 14px;
}

.cmodal__desc p:last-child { margin-bottom: 0; }

/* Upcoming sessions (matched from the calendar) */
.cmodal__sessions {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 2px solid var(--steel);
}

.cmodal__sessions-label {
  display: block;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent-text);
  margin-bottom: 10px;
}

.cmodal__sessions-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cmodal__session {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 14px;
  padding: 10px 12px;
  background: var(--hazard-dim);
  border-left: 3px solid var(--hazard);
}

.cmodal__session-when {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}

.cmodal__session-date {
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent-text);
}

.cmodal__session-time {
  font-family: var(--font-ui);
  font-size: 12px;
  color: var(--ash);
}

.cmodal__session-register {
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--tape-dark);
  background: var(--hazard);
  border: 1px solid var(--tape-dark);
  padding: 6px 11px;
  text-decoration: none;
  white-space: nowrap;
  transition: transform var(--transition-fast);
}

.cmodal__session-register:hover {
  transform: translate(-1px, -1px);
}

.cmodal__session-register--info {
  background: transparent;
  color: var(--ash);
  border-color: var(--steel-hi);
  cursor: default;
}

/* Gallery */
.cmodal__gallery {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 2px solid var(--steel);
}

.cmodal__gallery-label {
  display: block;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--smoke);
  margin-bottom: 10px;
}

.cmodal__thumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cmodal__thumb {
  width: 72px;
  height: 56px;
  padding: 0;
  border: 2px solid var(--steel-hi);
  background: var(--grime);
  cursor: pointer;
  overflow: hidden;
  transition: border-color var(--transition-fast);
}

.cmodal__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cmodal__thumb:hover { border-color: var(--hazard); }
.cmodal__thumb.active { border-color: var(--hazard); }

.cmodal__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 2px solid var(--steel);
}

.cmodal__cta {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 12px 20px;
  text-decoration: none;
  border: 2px solid var(--tape-dark);
  background: var(--hazard);
  color: var(--tape-dark);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.cmodal__cta:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow);
}

.cmodal__cta--ghost {
  background: transparent;
  color: var(--color-text-primary);
  border-color: var(--steel-hi);
  box-shadow: none;
}

.cmodal__cta--ghost:hover {
  border-color: var(--hazard);
  color: var(--accent-text);
  transform: none;
  box-shadow: none;
}

/* ---------- LIGHTBOX ---------- */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-toast);
  padding: var(--space-4);
  cursor: zoom-out;
}

.lightbox__img {
  max-width: min(1000px, 92vw);
  max-height: 88vh;
  object-fit: contain;
  cursor: default;
  border: 2px solid var(--tape-dark);
}

.lightbox__close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--tape-dark);
  color: var(--on-dark);
  border: none;
  cursor: pointer;
}

.lightbox__close svg { width: 22px; height: 22px; }

.lightbox__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 17, 13, 0.7);
  color: var(--on-dark);
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.lightbox__nav:hover { background: var(--hazard); color: var(--tape-dark); }
.lightbox__nav svg { width: 24px; height: 24px; }
.lightbox__nav--prev { left: 18px; }
.lightbox__nav--next { right: 18px; }

.lightbox__count {
  position: absolute;
  bottom: 18px;
  left: 0;
  right: 0;
  text-align: center;
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.12em;
  color: var(--on-dark);
}

@media (max-width: 600px) {
  .cat__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .cat__card-title { font-size: 14px; }
  .cat__desc { -webkit-line-clamp: 2; font-size: 13px; }
  .cat__nav { opacity: 1; width: 26px; height: 26px; }
  .cat__filter { width: 100%; }
  .cat__filter-btn {
    flex: 1;
    justify-content: center;
    padding: 9px 8px;
    letter-spacing: 0.06em;
  }
  .cmodal__body { padding: var(--space-5) var(--space-5) var(--space-6); }
  .lightbox__nav { width: 40px; height: 40px; }
  .lightbox__nav--prev { left: 8px; }
  .lightbox__nav--next { right: 8px; }
}
</style>
