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
        <div class="upcoming__title-cell">{{ event.displayTitle || event.title }}</div>
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
  margin-bottom: var(--space-5);
}

.upcoming__title {
  font-size: var(--text-3xl);
  font-weight: 400;
  font-family: var(--font-display);
  color: var(--color-text-primary);
  margin: 0;
  line-height: 0.95;
  text-shadow: none;
}

.upcoming__state {
  padding: var(--space-8) 0;
  text-align: center;
  color: var(--color-text-tertiary);
  font-family: var(--font-body);
}

.upcoming__list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 2px solid var(--color-border);
}

.upcoming__row {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: var(--space-4);
  align-items: baseline;
  padding: var(--space-3) var(--space-1);
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.upcoming__row:hover {
  background-color: var(--orange-dim2);
}

.upcoming__when {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.upcoming__date {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent-secondary);
  white-space: nowrap;
}

.upcoming__time {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-text-secondary);
}

.upcoming__title-cell {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.3;
}

.upcoming__footer {
  margin-top: var(--space-5);
  display: flex;
  justify-content: center;
}

:global(.card.upcoming) {
  border: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .upcoming__row {
    grid-template-columns: 110px 1fr;
    gap: var(--space-3);
  }
  .upcoming__title-cell {
    font-size: var(--text-sm);
  }
}
</style>
