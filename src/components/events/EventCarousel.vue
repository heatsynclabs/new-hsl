<template>
  <ul class="ec" :class="`ec--${layout}`" role="list">
    <li
      v-for="entry in entries"
      :key="entry.key"
      class="ec__card"
      :class="`ec__card--${entry.category}`"
      @click="$emit('select', entry.event)"
    >
      <span v-if="!hideTag" class="ec__tag">{{ entry.tag ?? categoryLabel(entry.category) }}</span>
      <h3 class="ec__title">
        <EventIcon v-if="entry.icon" :name="entry.icon" class="ec__icon" />
        <span class="ec__title-text">{{ entry.title }}</span>
      </h3>
      <div class="ec__meta">
        <span class="ec__date">{{ entry.dateLabel }}</span>
        <span v-if="entry.timeLabel" class="ec__time">{{ entry.timeLabel }}</span>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { CalendarEvent } from '../../services/calendarService'
import type { EventCategory } from '../../utils/eventCategory'
import { categoryLabel } from '../../utils/eventCategory'
import EventIcon from './EventIcon.vue'

export interface CarouselEntry {
  key: string
  title: string
  /** e.g. "Wed May 27" or "Next · May 27" */
  dateLabel: string
  /** e.g. "9:00 AM – 3:00 PM"; omit for all-day */
  timeLabel?: string
  category: EventCategory
  event: CalendarEvent
  /** Optional icon name (key in eventIcons.ts) for the card. Color comes
      from category — the icon just identifies WHICH known event it is. */
  icon?: string
  /** Optional override for the tag text. Color still comes from `category`;
      this lets a registration "class" event read Class / Workshop /
      Certification instead of the generic category label. */
  tag?: string
}

withDefaults(defineProps<{
  entries: CarouselEntry[]
  /** rail = horizontal scroll (default), grid = wrapping auto-fill grid.
      Grid still falls back to horizontal scroll on mobile to keep cards
      tappable at usable size. */
  layout?: 'rail' | 'grid'
  /** Hide per-card category tag (e.g. inside a "Recurring Events" section
      where the section title already announces the category). */
  hideTag?: boolean
}>(), {
  layout: 'rail',
  hideTag: false,
})

defineEmits<{ (e: 'select', event: CalendarEvent): void }>()
</script>

<style scoped>
.ec {
  list-style: none;
  margin: 0;
  /* bottom padding leaves room for the card's hard-offset shadow so it
     doesn't visually crash into the section below */
  padding: 4px 0 18px;
}

/* Rail (default) — horizontal side-scroll */
.ec--rail {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.ec--rail::-webkit-scrollbar { height: 6px; }
.ec--rail::-webkit-scrollbar-thumb { background: var(--steel-hi); }

.ec--rail .ec__card {
  flex: 0 0 260px;
  scroll-snap-align: start;
}

/* Grid — wraps onto rows on desktop, falls back to rail on mobile */
.ec--grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}

@media (max-width: 600px) {
  .ec--grid {
    display: flex;
    gap: 14px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }
  .ec--grid .ec__card {
    flex: 0 0 220px;
    scroll-snap-align: start;
  }
}

.ec__card {
  background: var(--slab);
  border: 2px solid var(--steel-hi);
  border-left: 4px solid var(--cat, var(--smoke));
  box-shadow: var(--shadow-sm);
  padding: 18px 18px 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  min-height: 140px;
}

.ec__card:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow);
}

/* Category accents — these map to the palette in src/utils/eventCategory.ts */
.ec__card--class     { --cat: var(--hazard); }
.ec__card--open      { --cat: var(--hazard); }
.ec__card--hack      { --cat: var(--rust); }
.ec__card--group     { --cat: var(--info); }
.ec__card--recurring { --cat: var(--live); }
.ec__card--default   { --cat: var(--smoke); }

.ec__tag {
  align-self: flex-start;
  font-family: var(--font-ui);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: 1px solid var(--cat, var(--smoke));
  color: var(--cat, var(--color-text-secondary));
  padding: 3px 7px;
  line-height: 1.4;
  white-space: nowrap;
}

.ec__card--class .ec__tag {
  background: var(--hazard);
  color: var(--tape-dark);
  border-color: var(--tape-dark);
}

.ec__title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 17px;
  line-height: 1.15;
  text-transform: uppercase;
  letter-spacing: -0.005em;
  color: var(--color-text-primary);
  margin: 0;
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.ec__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: var(--cat, var(--color-text-secondary));
  margin-top: 1px;
}

.ec__title-text {
  flex: 1;
  min-width: 0;
  /* clamp long titles so cards stay even */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere;
}

.ec__meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: auto;
}

.ec__date {
  color: var(--accent-text);
  font-weight: 600;
}

.ec__time {
  color: var(--ash);
}

@media (max-width: 600px) {
  /* Note: .ec--grid .ec__card mobile sizing handled in the grid block above.
     This rule only applies to rail-layout cards on mobile. */
  .ec--rail .ec__card { flex: 0 0 220px; padding: 14px; min-height: 130px; }
  .ec__title { font-size: 15px; }
  .ec__meta { font-size: 11px; }
}
</style>
