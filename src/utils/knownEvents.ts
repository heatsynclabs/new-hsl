/**
 * Known named events — a curated registry of recurring/repeated HeatSync
 * events that we recognize by title substring. When detected, the event
 * surface (carousel card, calendar dot, day-view row) gets a specific icon.
 *
 * Color is intentionally NOT specified here — it comes from the event's
 * category (see eventCategory.ts). That keeps the category color system
 * consistent and avoids per-event color sprawl. The icon is what
 * distinguishes one known event from another within the same category.
 *
 * Add entries by appending below. Match is case-insensitive substring on the
 * event title; first match wins (order matters).
 */

export interface KnownEvent {
  /** lowercase substring matched against event title */
  match: string
  /** icon name — key into EVENT_ICONS in eventIcons.ts */
  icon: string
}

export const KNOWN_EVENTS: KnownEvent[] = [
  // Coffee / coworking
  { match: 'caffeine',              icon: 'coffee' },

  // Maker / craft
  { match: 'craft night',           icon: 'scissors' },
  { match: 'sewing',                icon: 'scissors' },
  { match: 'jewelry',               icon: 'gem' },
  { match: 'lego',                  icon: 'blocks' },

  // 3D print / fabrication
  { match: '3d-printer',            icon: 'printer' },
  { match: 'prusa',                 icon: 'printer' },
  { match: 'laser meetup',          icon: 'zap' },
  { match: 'laser cutter',          icon: 'zap' },

  // Tech / code
  { match: 'freecad',               icon: 'pencil' },
  { match: 'arduino',               icon: 'cpu' },
  { match: 'group programming',     icon: 'code' },
  { match: 'leetcode',              icon: 'code' },
  { match: 'phxjs',                 icon: 'code' },
  { match: 'phoenix gdg',           icon: 'globe' },
  { match: 'owasp',                 icon: 'shield' },
  { match: 'book club',             icon: 'book' },

  // Social / play
  { match: "d&d",                   icon: 'dice' },
  { match: 'young makers',          icon: 'users' },
  { match: 'photo meetup',          icon: 'camera' },
  { match: 'browser wars',          icon: 'globe' },

  // Skill / security
  { match: 'lock picking',          icon: 'lock' },
  { match: 'hack your hackerspace', icon: 'wrench' },
]

export function findKnownEvent(title: string | undefined | null): KnownEvent | null {
  if (!title) return null
  const lower = title.toLowerCase()
  return KNOWN_EVENTS.find(k => lower.includes(k.match)) || null
}
