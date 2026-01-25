<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="closeModal">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div v-if="event" class="modal-body">
        <h2 class="event-title">{{ event.displayTitle }}</h2>

        <a
          v-if="event.requiresRegistration && event.registrationUrl"
          :href="event.registrationUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="event-registration event-registration--link"
          @click.stop
        >
          <svg class="registration-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Register for this event<span v-if="event.registrationCost"> · {{ event.registrationCost }}</span>
        </a>
        <div v-else-if="event.requiresRegistration" class="event-registration">
          <svg class="registration-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Registration required<span v-if="event.registrationCost"> · {{ event.registrationCost }}</span>
        </div>

        <div class="event-meta">
          <div class="event-date">
            <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ formatEventDate(event) }}
          </div>

          <div class="event-time">
            <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ formatEventTime(event) }}
          </div>

        </div>

        <div v-if="event.description" class="event-description">
          <h3>Details</h3>
          <div v-html="event.description"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import type { CalendarEvent } from '../../services/calendarService'

interface Props {
  visible: boolean
  event: CalendarEvent | null
}

interface Emits {
  close: []
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const closeModal = () => {
  emit('close')
}

const formatEventDate = (event: CalendarEvent): string => {
  return format(event.start, 'EEEE, MMMM d, yyyy')
}

const formatEventTime = (event: CalendarEvent): string => {
  if (event.isAllDay) {
    return 'All Day'
  }
  return `${format(event.start, 'h:mm a')} - ${format(event.end, 'h:mm a')}`
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-4);
}

.modal-content {
  background: var(--paper-white);
  border-radius: var(--radius-lg);
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  cursor: pointer;
  color: var(--warm-gray);
  transition: color var(--transition-base);
  z-index: 1;
}

.modal-close:hover {
  color: var(--ink-black);
}

.modal-close svg {
  width: 100%;
  height: 100%;
}

.modal-body {
  padding: var(--space-8);
}

.event-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-medium);
  color: var(--ink-black);
  margin-bottom: var(--space-4);
  padding-right: var(--space-8);
  line-height: var(--leading-tight);
}

.event-registration {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--accent-sage);
  font-family: var(--font-sans);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-4);
  padding: var(--space-2) var(--space-3);
  background: rgba(104, 127, 93, 0.1);
  border-radius: var(--radius-sm);
  width: fit-content;
}

.event-registration--link {
  text-decoration: none;
  cursor: pointer;
  transition: background var(--transition-base), color var(--transition-base);
}

.event-registration--link:hover {
  background: rgba(104, 127, 93, 0.2);
  color: var(--ink-black);
}

.event-registration--link:hover .registration-icon {
  color: var(--ink-black);
}

.registration-icon {
  width: 18px;
  height: 18px;
  color: var(--accent-sage);
  flex-shrink: 0;
  transition: color var(--transition-base);
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.event-date,
.event-time,
.event-location {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-base);
  color: var(--graphite);
  font-family: var(--font-sans);
}

.icon {
  width: 20px;
  height: 20px;
  color: var(--accent-rust);
  flex-shrink: 0;
}

.event-description {
  border-top: 1px solid var(--warm-gray);
  padding-top: var(--space-6);
}

.event-description h3 {
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  color: var(--ink-black);
  margin-bottom: var(--space-3);
}

.event-description div {
  font-size: var(--text-base);
  color: var(--graphite);
  line-height: var(--leading-relaxed);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--space-2);
  }

  .modal-body {
    padding: var(--space-6);
  }

  .event-title {
    font-size: var(--text-xl);
  }
}
</style>