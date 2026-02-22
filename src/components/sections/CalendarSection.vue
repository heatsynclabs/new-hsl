<template>
  <section class="calendar-section">
    <BaseContainer>
      <h2 class="calendar__title">Upcoming Events</h2>

      <div v-if="loading" class="calendar__loading">
        <p>Loading events...</p>
      </div>

      <div v-else-if="error" class="calendar__error">
        <p>Unable to load calendar events at this time.</p>
      </div>

      <div v-else-if="events.length === 0" class="calendar__empty">
        <p>No upcoming events scheduled.</p>
      </div>

      <div v-else class="calendar__events">
        <div class="events-grid">
          <EventCard
            v-for="event in events"
            :key="event.id"
            :event="event"
            :isCompact="true"
            @click="openEventModal"
          />
        </div>
      </div>

      <div class="calendar__footer">
        <BaseButton variant="outline" href="/calendar">
          View Full Calendar
        </BaseButton>
      </div>
    </BaseContainer>

    <EventModal
      :visible="modalVisible"
      :event="selectedEvent"
      @close="closeEventModal"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BaseContainer from '../base/BaseContainer.vue'
import BaseButton from '../base/BaseButton.vue'
import EventCard from '../events/EventCard.vue'
import EventModal from '../events/EventModal.vue'
import { CalendarService, type CalendarEvent } from '../../services/calendarService'

const allEvents = ref<CalendarEvent[]>([])
const loading = ref(true)
const error = ref(false)
const modalVisible = ref(false)
const selectedEvent = ref<CalendarEvent | null>(null)
const isMobile = ref(typeof window !== 'undefined' ? window.innerWidth <= 768 : false)

const calendarService = new CalendarService()

const events = computed(() => {
  if (isMobile.value) {
    return allEvents.value.slice(0, 3)
  }
  return allEvents.value
})

const onResize = () => {
  isMobile.value = window.innerWidth <= 768
}

const loadEvents = async () => {
  try {
    loading.value = true
    error.value = false
    allEvents.value = await calendarService.getEvents(14) // Next 2 weeks for upcoming events
  } catch (err) {
    console.error('Failed to load calendar events:', err)
    error.value = true
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
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.calendar-section {
  padding: var(--space-6) 0 var(--space-2) 0;
  background: var(--color-bg-primary);
}

.calendar__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-normal);
  margin-bottom: var(--space-4);
  text-align: center;
  color: var(--color-text-primary);
}

.calendar__loading,
.calendar__error,
.calendar__empty {
  text-align: center;
  padding: var(--space-16);
  color: var(--warm-gray);
  font-family: var(--font-sans);
}

.calendar__events {
  max-width: 100%;
  margin: 0 auto;
}

.events-grid {
  display: flex;
  gap: var(--space-4);
  overflow-x: auto;
  padding: var(--space-2) 0 var(--space-4) 0;
  scroll-behavior: smooth;
}

.events-grid :deep(.event-card) {
  flex: 0 0 300px;
}

.events-grid::-webkit-scrollbar {
  height: 8px;
}

.events-grid::-webkit-scrollbar-track {
  background: var(--warm-gray);
  border-radius: var(--radius-full);
}

.events-grid::-webkit-scrollbar-thumb {
  background: var(--accent-rust);
  border-radius: var(--radius-full);
}

.events-grid::-webkit-scrollbar-thumb:hover {
  background: var(--accent-sage);
}

.calendar__footer {
  text-align: center;
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid rgba(107, 104, 102, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .calendar-section {
    padding: var(--space-12) 0;
  }

  .events-grid {
    display: flex;
    flex-direction: column;
    overflow-x: visible;
    padding: 0;
  }

  .events-grid :deep(.event-card) {
    flex: none;
    width: 100%;
  }
}
</style>