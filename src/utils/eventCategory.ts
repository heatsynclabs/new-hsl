/**
 * Event categorization — pure functions, no Vue dependencies.
 * Categories are detected from data we know we have: title text and the
 * requiresRegistration flag. Recurrence detection requires a precomputed
 * Set of titles (computed by the consumer over an appropriate horizon).
 *
 * Category palette is bound to existing theme tokens — see EventCarousel.vue
 * and FullCalendar.vue for the CSS that consumes these category strings.
 */
import type { CalendarEvent } from '../services/calendarService'

export type EventCategory = 'class' | 'open' | 'hack' | 'group' | 'recurring' | 'default'

const CATEGORY_LABELS: Record<EventCategory, string> = {
  class: 'Workshop',
  open: 'Open Hours',
  hack: 'HYH',
  group: 'Group',
  recurring: 'Recurring',
  default: 'Event',
}

/** Fallback icon (name into eventIcons.ts) per category when no known event matches. */
const CATEGORY_ICONS: Record<EventCategory, string> = {
  class: 'graduation',
  open: 'door',
  hack: 'wrench',
  group: 'users',
  recurring: 'repeat',
  default: 'calendar',
}

// Title keywords that flag an event as a recurring group/meetup/club regardless
// of our recurrence detection — useful for once-detected-twice-from-Google
// meetings that we still want to color as "group" rather than the generic
// recurring green.
const GROUP_KEYWORDS = ['meetup', 'study group', 'users group', 'chapter meeting', 'chapter', 'book club', 'society']

/**
 * Categorize an event. Priority order matters:
 *   1. class      — requiresRegistration === true (action required)
 *   2. open       — title contains "open hours" / "member hours"
 *   3. hack       — title contains "hack your hackerspace"
 *   4. group      — title contains a meetup/group/chapter keyword
 *   5. recurring  — title appears in another future occurrence
 *   6. default    — everything else (NOT labeled "one-time" — could recur
 *                   outside our 90-day detection window)
 */
export function categorize(
  event: CalendarEvent,
  recurringTitles: Set<string>
): EventCategory {
  if (event.requiresRegistration) return 'class'
  const title = event.title.toLowerCase()
  if (title.includes('open hours') || title.includes('member hours')) return 'open'
  if (title.includes('hack your hackerspace')) return 'hack'
  if (GROUP_KEYWORDS.some(k => title.includes(k))) return 'group'
  if (recurringTitles.has(title)) return 'recurring'
  return 'default'
}

export function categoryLabel(cat: EventCategory): string {
  return CATEGORY_LABELS[cat]
}

export function categoryIcon(cat: EventCategory): string {
  return CATEGORY_ICONS[cat]
}
