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
        <div class="events-carousel">
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
        <BaseButton variant="outline" to="/calendar">
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
import { ref, onMounted } from 'vue'
import BaseContainer from '../base/BaseContainer.vue'
import BaseButton from '../base/BaseButton.vue'
import EventCard from '../events/EventCard.vue'
import EventModal from '../events/EventModal.vue'
import { CalendarService, type CalendarEvent } from '../../services/calendarService'

const events = ref<CalendarEvent[]>([])
const loading = ref(true)
const error = ref(false)
const modalVisible = ref(false)
const selectedEvent = ref<CalendarEvent | null>(null)

const calendarService = new CalendarService()

const loadEvents = async () => {
  try {
    loading.value = true
    error.value = false
    events.value = await calendarService.getEvents(14) // Next 2 weeks for upcoming events
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
})
</script>

<style scoped>
.calendar-section {
  padding: var(--space-12) 0;
  background: var(--paper-white);
}

.calendar__title {
  font-size: var(--text-3xl);
  font-weight: var(--font-normal);
  margin-bottom: var(--space-8);
  text-align: center;
  color: var(--ink-black);
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

.events-carousel {
  display: flex;
  gap: var(--space-4);
  overflow-x: auto;
  padding: var(--space-2) 0 var(--space-4) 0;
  scroll-behavior: smooth;
}

.events-carousel::-webkit-scrollbar {
  height: 8px;
}

.events-carousel::-webkit-scrollbar-track {
  background: var(--warm-gray);
  border-radius: var(--radius-full);
}

.events-carousel::-webkit-scrollbar-thumb {
  background: var(--accent-rust);
  border-radius: var(--radius-full);
}

.events-carousel::-webkit-scrollbar-thumb:hover {
  background: var(--accent-sage);
}

.events-carousel .event-card {
  flex: 0 0 280px;
}

.calendar__footer {
  text-align: center;
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid rgba(107, 104, 102, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .calendar-section {
    padding: var(--space-16) 0;
  }

  .calendar__event {
    flex-direction: column;
    text-align: center;
  }

  .event__date {
    align-self: center;
    margin-bottom: var(--space-3);
  }
}
</style>