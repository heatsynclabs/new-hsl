<template>
  <section class="uc">
    <div class="uc__head">
      <h2 class="uc__title">Upcoming Classes</h2>
      <p class="uc__sub">
        Scheduled sessions you can sign up for right now. Pulled live from our calendar.
      </p>
    </div>

    <div
      v-if="!loading && !error && classes.length && typeFilters.length > 2"
      class="uc__filter"
      role="tablist"
      aria-label="Filter upcoming classes by type"
    >
      <button
        v-for="opt in typeFilters"
        :key="opt.value"
        type="button"
        role="tab"
        :aria-selected="activeType === opt.value"
        :class="['uc__filter-btn', { active: activeType === opt.value }]"
        @click="activeType = opt.value"
      >
        {{ opt.label }}
        <span class="uc__filter-count">{{ opt.count }}</span>
      </button>
    </div>

    <div v-if="loading" class="uc__state">Loading upcoming classes…</div>
    <div v-else-if="error" class="uc__state">Unable to load classes. Please try again later.</div>
    <div v-else-if="classes.length === 0" class="uc__state uc__state--empty">
      <p>No classes are on the schedule at the moment.</p>
      <p class="uc__state-hint">
        New classes are posted regularly — join the
        <a href="/register">interest list</a> to get notified, or
        <a href="/calendar">browse the full calendar</a>.
      </p>
    </div>

    <ul v-else-if="visibleClasses.length" class="uc__grid" role="list">
      <li
        v-for="entry in visibleClasses"
        :key="entry.event.id"
        class="uc__card"
        @click="openModal(entry.event)"
      >
        <div class="uc__card-top">
          <span class="uc__tag">
            <EventIcon :name="entry.icon" class="uc__tag-icon" />
            {{ entry.typeLabel }}
          </span>
          <span v-if="entry.event.registrationCost" class="uc__cost">{{ entry.event.registrationCost }}</span>
        </div>

        <h3 class="uc__card-title">{{ entry.event.displayTitle || entry.event.title }}</h3>

        <div class="uc__when">
          <span class="uc__date">{{ entry.dateLabel }}</span>
          <span v-if="entry.timeLabel" class="uc__time">{{ entry.timeLabel }}</span>
        </div>

        <p v-if="entry.snippet" class="uc__desc">{{ entry.snippet }}</p>

        <div class="uc__actions">
          <a
            v-if="entry.event.registrationUrl"
            :href="entry.event.registrationUrl"
            target="_blank"
            rel="noopener"
            class="uc__register"
            @click.stop
          >Register →</a>
          <span v-else class="uc__register uc__register--info">Registration required</span>
          <button type="button" class="uc__details" @click.stop="openModal(entry.event)">Details</button>
        </div>
      </li>
    </ul>

    <div v-else class="uc__state">No {{ activeTypeLabel.toLowerCase() }} on the schedule right now.</div>

    <EventModal :visible="modalVisible" :event="selectedEvent" @close="closeModal" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import EventModal from '../events/EventModal.vue'
import EventIcon from '../events/EventIcon.vue'
import { findKnownEvent } from '../../utils/knownEvents'
import { classifyClass, classTypeLabel, CLASS_TYPE_META, type ClassType } from '../../utils/classType'
import { CalendarService, type CalendarEvent } from '../../services/calendarService'

interface ClassEntry {
  event: CalendarEvent
  dateLabel: string
  timeLabel?: string
  snippet?: string
  icon: string
  type: ClassType
  typeLabel: string
}

const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 12 })

const classes = ref<ClassEntry[]>([])
const loading = ref(true)
const error = ref(false)

// ---- type filter (Classes / Workshops / Certifications) ----
const TYPE_ORDER: ClassType[] = ['class', 'workshop', 'certification']
const activeType = ref<'all' | ClassType>('all')

const typeFilters = computed(() => {
  const counts = {} as Record<ClassType, number>
  for (const c of classes.value) counts[c.type] = (counts[c.type] ?? 0) + 1
  const present = TYPE_ORDER.filter(t => counts[t])
  return [
    { value: 'all' as 'all' | ClassType, label: 'All', count: classes.value.length },
    ...present.map(t => ({ value: t as 'all' | ClassType, label: CLASS_TYPE_META[t].plural, count: counts[t] })),
  ]
})

const visibleClasses = computed(() =>
  activeType.value === 'all'
    ? classes.value
    : classes.value.filter(c => c.type === activeType.value)
)

const activeTypeLabel = computed(() =>
  activeType.value === 'all' ? 'Classes' : CLASS_TYPE_META[activeType.value].plural
)
const modalVisible = ref(false)
const selectedEvent = ref<CalendarEvent | null>(null)

const calendarService = new CalendarService()

const snippet = (html: string): string => {
  if (!html) return ''
  const plain = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (plain.length <= 120) return plain
  return plain.substring(0, 117).trim() + '…'
}

const timeLabel = (e: CalendarEvent): string | undefined => {
  if (e.isAllDay) return undefined
  return `${format(e.start, 'h:mm a')} – ${format(e.end, 'h:mm a')}`
}

const openModal = (event: CalendarEvent) => {
  selectedEvent.value = event
  modalVisible.value = true
}
const closeModal = () => {
  modalVisible.value = false
  selectedEvent.value = null
}

onMounted(async () => {
  try {
    const all = await calendarService.getAllFutureEvents()
    // "Actual classes" = future calendar events that require registration —
    // these carry a registration link / cost, the same signal the calendar
    // uses for its 'class' category. Dedupe by title so a recurring class
    // series shows only its next session.
    const seen = new Set<string>()
    const result: ClassEntry[] = []
    for (const event of all) {
      if (!event.requiresRegistration) continue
      const key = (event.displayTitle || event.title).toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      const known = findKnownEvent(event.title)
      const type = classifyClass(event.displayTitle || event.title, event.description || '')
      result.push({
        event,
        dateLabel: format(event.start, 'EEE MMM d'),
        timeLabel: timeLabel(event),
        snippet: snippet(event.description || ''),
        icon: known?.icon ?? 'graduation',
        type,
        typeLabel: classTypeLabel(type),
      })
      if (result.length >= props.limit) break
    }
    classes.value = result
  } catch (e) {
    console.error('Failed to load upcoming classes:', e)
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.uc__head {
  margin-bottom: 22px;
}

.uc__title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(26px, 3.8vw, 40px);
  text-transform: uppercase;
  letter-spacing: -0.01em;
  line-height: 0.95;
  color: var(--color-text-primary);
  margin: 0;
}

.uc__sub {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--ash);
  line-height: var(--leading-relaxed);
  margin: 10px 0 0;
  max-width: 60ch;
}

/* Type filter — segmented control matching the catalog/calendar DNA */
.uc__filter {
  display: inline-flex;
  flex-wrap: wrap;
  border: 2px solid var(--steel-hi);
  margin-bottom: 22px;
}

.uc__filter-btn {
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

.uc__filter-btn:last-child { border-right: none; }
.uc__filter-btn:hover { color: var(--accent-text); }

.uc__filter-btn.active {
  background: var(--hazard);
  color: var(--tape-dark);
}

.uc__filter-count {
  font-size: 10px;
  opacity: 0.7;
}

.uc__state {
  padding: 40px 0;
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--smoke);
}

.uc__state--empty {
  text-transform: none;
  letter-spacing: 0;
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--ash);
}

.uc__state-hint {
  margin-top: 10px;
  font-size: var(--text-sm);
  color: var(--smoke);
}

.uc__state-hint a {
  color: var(--accent-text);
  border-bottom: 1px solid var(--hazard);
  text-decoration: none;
}

.uc__grid {
  list-style: none;
  margin: 0;
  padding: 4px 0 18px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.uc__card {
  background: var(--slab);
  border: 2px solid var(--steel-hi);
  border-left: 4px solid var(--hazard);
  box-shadow: var(--shadow-sm);
  padding: 18px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.uc__card:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow);
}

.uc__card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.uc__tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-ui);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: var(--hazard);
  color: var(--tape-dark);
  border: 1px solid var(--tape-dark);
  padding: 3px 8px;
  line-height: 1.4;
}

.uc__tag-icon {
  width: 12px;
  height: 12px;
}

.uc__cost {
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--accent-text);
}

.uc__card-title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 19px;
  line-height: 1.12;
  text-transform: uppercase;
  letter-spacing: -0.005em;
  color: var(--color-text-primary);
  margin: 0;
  overflow-wrap: anywhere;
}

.uc__when {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.uc__date {
  color: var(--accent-text);
  font-weight: 600;
}

.uc__time {
  color: var(--ash);
}

.uc__desc {
  font-family: var(--font-body);
  font-size: 14px;
  line-height: var(--leading-relaxed);
  color: var(--ash);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.uc__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding-top: 4px;
}

.uc__register {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--tape-dark);
  background: var(--hazard);
  border: 1px solid var(--tape-dark);
  padding: 8px 14px;
  text-decoration: none;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.uc__register:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow);
}

.uc__register--info {
  background: transparent;
  color: var(--ash);
  border-color: var(--steel-hi);
  box-shadow: none;
  cursor: default;
}

.uc__details {
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-text);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 4px;
}

.uc__details:hover {
  color: var(--color-text-primary);
}

@media (max-width: 600px) {
  .uc__grid {
    grid-template-columns: 1fr;
  }
  .uc__card-title {
    font-size: 17px;
  }
  .uc__filter { width: 100%; }
  .uc__filter-btn {
    flex: 1;
    justify-content: center;
    padding: 9px 4px;
    gap: 4px;
    font-size: 10px;
    letter-spacing: 0.02em;
  }
}
</style>
