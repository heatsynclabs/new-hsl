<template>
  <div class="event-card" @click="$emit('click', event)">
    <div class="event-content">
      <h4 class="event-title">{{ truncateTitle(event.displayTitle) }}</h4>
      <div class="event-date-line">
        <svg class="calendar-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ formatMonthDay(event.start) }}
      </div>
      <div class="event-time">{{ formatEventTime(event) }}</div>
      <div v-if="event.requiresRegistration" class="event-registration">
        <svg class="registration-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Registration required<span v-if="event.registrationCost"> · {{ event.registrationCost }}</span>
      </div>
      <div v-if="event.description" class="event-description" v-html="truncateDescription(event.description)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import type { CalendarEvent } from '../../services/calendarService'

interface Props {
  event: CalendarEvent
  isCompact?: boolean
}

interface Emits {
  click: [event: CalendarEvent]
}

const props = withDefaults(defineProps<Props>(), {
  isCompact: false
})

defineEmits<Emits>()

const formatMonthDay = (date: Date): string => {
  return format(date, 'MMM d')
}

const formatEventTime = (event: CalendarEvent): string => {
  if (event.isAllDay) {
    return 'All Day'
  }
  return `${format(event.start, 'h:mm a')} - ${format(event.end, 'h:mm a')}`
}

const truncateTitle = (title: string): string => {
  if (title.length <= 40) return title
  return title.substring(0, 37).trim() + '...'
}

const truncateDescription = (description: string): string => {
  if (description.length <= 80) return description
  return description.substring(0, 77).trim() + '...'
}
</script>

<style scoped>
.event-card {
  padding: var(--space-4);
  background: var(--cream);
  border-radius: var(--radius-base);
  box-shadow: 2px 2px 8px var(--shadow-light);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-height: 140px;
}

.event-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-rust), var(--accent-sage));
  border-radius: var(--radius-base) var(--radius-base) 0 0;
}

.event-card:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 10px var(--shadow-medium);
}

.event-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.event-date-line {
  font-size: var(--text-sm);
  color: var(--accent-rust);
  margin-bottom: var(--space-2);
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.calendar-icon {
  width: 16px;
  height: 16px;
  color: var(--accent-rust);
}

.event-title {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--ink-black);
  font-family: var(--font-sans);
  line-height: var(--leading-tight);
}

.event-time {
  font-size: var(--text-xs);
  color: var(--accent-rust);
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
}

.event-registration {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  color: var(--accent-sage);
  font-family: var(--font-sans);
  font-weight: var(--font-medium);
  margin-top: var(--space-1);
  padding: var(--space-1) var(--space-2);
  background: rgba(104, 127, 93, 0.1);
  border-radius: var(--radius-sm);
  width: fit-content;
}

.registration-icon {
  width: 14px;
  height: 14px;
  color: var(--accent-sage);
  flex-shrink: 0;
}

.event-description {
  font-size: var(--text-xs);
  color: var(--graphite);
  line-height: var(--leading-relaxed);
  font-family: var(--font-sans);
  overflow: hidden;
}

/* Responsive */
@media (max-width: 768px) {
  .event-card {
    text-align: center;
  }
}
</style>