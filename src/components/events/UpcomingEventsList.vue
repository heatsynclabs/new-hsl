<template>
  <BaseCard padding="lg" class="upcoming">
    <div class="upcoming__header">
      <h2 class="upcoming__title">Upcoming Events</h2>
    </div>

    <div v-if="loading" class="upcoming__state">
      <p>Loading events…</p>
    </div>

    <div v-else-if="error" class="upcoming__state">
      <p>Unable to load events.</p>
    </div>

    <div v-else-if="events.length === 0" class="upcoming__state">
      <p>No upcoming events scheduled.</p>
    </div>

    <ul v-else class="upcoming__list">
      <li
        v-for="event in events"
        :key="event.id"
        class="upcoming__row"
        @click="openEventModal(event)"
      >
        <div class="upcoming__when">
          <span class="upcoming__date">{{ formatDate(event.start) }}</span>
          <span v-if="!event.isAllDay" class="upcoming__time">{{ formatTime(event.start) }}</span>
          <span v-else class="upcoming__time">All day</span>
        </div>
        <div class="upcoming__body">
          <div class="upcoming__title-cell">{{ event.displayTitle || event.title }}</div>
          <p v-if="event.description" class="upcoming__desc">{{ shortDesc(event.description) }}</p>
        </div>
      </li>
    </ul>

    <div class="upcoming__footer">
      <BaseButton variant="outline" href="/calendar">
        View Full Calendar
      </BaseButton>
    </div>

    <EventModal
      :visible="modalVisible"
      :event="selectedEvent"
      @close="closeEventModal"
    />
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import BaseCard from '../base/BaseCard.vue'
import BaseButton from '../base/BaseButton.vue'
import EventModal from './EventModal.vue'
import { CalendarService, type CalendarEvent } from '../../services/calendarService'

const props = withDefaults(defineProps<{
  limit?: number
  daysAhead?: number
}>(), {
  limit: 6,
  daysAhead: 21,
})

const events = ref<CalendarEvent[]>([])
const loading = ref(true)
const error = ref(false)
const modalVisible = ref(false)
const selectedEvent = ref<CalendarEvent | null>(null)

const calendarService = new CalendarService()

const formatDate = (d: Date) => format(d, 'EEE MMM d')
const formatTime = (d: Date) => format(d, 'h:mm a').toLowerCase()

const shortDesc = (html: string): string => {
  if (!html) return ''
  const plain = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (plain.length <= 90) return plain
  return plain.substring(0, 87).trim() + '…'
}

const openEventModal = (event: CalendarEvent) => {
  selectedEvent.value = event
  modalVisible.value = true
}
const closeEventModal = () => {
  modalVisible.value = false
  selectedEvent.value = null
}

onMounted(async () => {
  try {
    const all = await calendarService.getEvents(props.daysAhead)
    events.value = all.slice(0, props.limit)
  } catch (e) {
    console.error('Failed to load upcoming events:', e)
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.upcoming__header {
  margin-bottom: 20px;
}

.upcoming__title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 32px;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  line-height: 1;
  color: var(--color-text-primary);
  margin: 0;
}

.upcoming__state {
  padding: var(--space-8) 0;
  text-align: center;
  color: var(--smoke);
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.upcoming__list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: var(--bd);
}

.upcoming__row {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 16px;
  align-items: baseline;
  padding: 14px 4px;
  border-bottom: var(--bd);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.upcoming__row:hover {
  background-color: var(--hazard-dim);
}

.upcoming__when {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.upcoming__date {
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-text);
  white-space: nowrap;
}

.upcoming__time {
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--ash);
}

.upcoming__body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.upcoming__title-cell {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 17px;
  color: var(--color-text-primary);
  line-height: 1.2;
  text-transform: none;
  letter-spacing: 0;
}

.upcoming__desc {
  font-family: var(--font-body);
  font-size: 13px;
  line-height: var(--leading-relaxed);
  color: var(--ash);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.upcoming__footer {
  margin-top: 26px;
  display: flex;
  justify-content: flex-start;
}

:global(.card.upcoming) {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

@media (max-width: 768px) {
  .upcoming__row {
    grid-template-columns: 110px 1fr;
    gap: 12px;
  }
  .upcoming__title-cell {
    font-size: 15px;
  }
}
</style>
