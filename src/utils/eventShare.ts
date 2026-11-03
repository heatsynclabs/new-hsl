/**
 * Event sharing helpers — pure URL building plus the one share/copy action.
 *
 * A shared event link points at /calendar/event/?id=<google event id>. The id
 * is the same instance id the calendar already carries (for a recurring event
 * it is the specific occurrence, e.g. `<base>_20261102T020000Z`), so the link
 * resolves to exactly the occurrence the person was looking at.
 *
 * The site is a static build on one origin in production
 * (https://www.heatsynclabs.org) but runs on localhost in dev, so absolute
 * links are built from the live origin at call time and fall back to the
 * production origin when there is no window (SSR/prerender).
 */
import type { CalendarEvent } from '../services/calendarService'

const PROD_ORIGIN = 'https://www.heatsynclabs.org'

/** Origin of the running site: the real one in the browser, prod when prerendering. */
function siteOrigin(): string {
  return typeof window !== 'undefined' ? window.location.origin : PROD_ORIGIN
}

/** Root-relative path to a single event's page. */
export function eventSharePath(id: string): string {
  return `/calendar/event/?id=${encodeURIComponent(id)}`
}

/** Absolute, shareable URL to a single event's page. */
export function eventShareUrl(id: string): string {
  return `${siteOrigin()}${eventSharePath(id)}`
}

/** Read the event id a share link carries (null when absent). */
export function eventIdFromLocation(search: string): string | null {
  const id = new URLSearchParams(search).get('id')
  return id && id.trim() ? id.trim() : null
}

// Google's "add to calendar" template wants compact UTC stamps: a timed event
// as YYYYMMDDTHHMMSSZ/YYYYMMDDTHHMMSSZ, an all-day event as YYYYMMDD/YYYYMMDD
// (the end date is exclusive, which is exactly how Google returns it, so the
// parsed all-day end is used as-is).
function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function utcStamp(date: Date): string {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  )
}

function localDateStamp(date: Date): string {
  // All-day values are local calendar dates (midnight local from the parser);
  // keep them as the plain YYYYMMDD Google expects, no timezone shift.
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
}

/** A Google Calendar "add to calendar" URL for one event. */
export function googleCalendarTemplateUrl(event: CalendarEvent): string {
  const dates = event.isAllDay
    ? `${localDateStamp(event.start)}/${localDateStamp(event.end)}`
    : `${utcStamp(event.start)}/${utcStamp(event.end)}`

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.displayTitle || event.title,
    dates,
  })
  // Details/location are optional; strip HTML the feed left in the description.
  const details = (event.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (details) params.append('details', details)
  if (event.location) params.append('location', event.location)

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export type ShareResult = 'shared' | 'copied' | 'error'

/**
 * Whether to offer the OS share sheet rather than a clipboard copy. Desktop
 * Chrome exposes navigator.share too, but opening the system share sheet from a
 * mouse click is surprising there; the native sheet is the good path on touch
 * devices (AirDrop, Messages, etc.). So gate it on a coarse pointer. Guarded
 * for SSR, where neither API exists.
 */
export function canNativeShare(): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') return false
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(pointer: coarse)').matches
}

/**
 * Share a link the way the device prefers: the native share sheet on touch
 * devices, otherwise copy the URL to the clipboard. Returns what happened so
 * the caller can show the right confirmation. A cancelled native share
 * (AbortError) falls back to copying, so the person still ends up with the link.
 */
export async function shareOrCopy(title: string, url: string): Promise<ShareResult> {
  if (canNativeShare()) {
    try {
      await navigator.share({ title, url })
      return 'shared'
    } catch {
      // Dismissed or failed — fall through to copying so the person still
      // ends up with the link (and an honest "copied" confirmation).
    }
  }

  return copyToClipboard(url)
}

/** Copy text to the clipboard, with a execCommand fallback for older/non-secure contexts. */
export async function copyToClipboard(text: string): Promise<ShareResult> {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined
  try {
    if (nav?.clipboard?.writeText) {
      // Race a timeout so a rare hung clipboard permission (seen when the tab
      // isn't focused) can't leave the button stuck "copying" forever; on
      // timeout we drop to the execCommand fallback below.
      await Promise.race([
        nav.clipboard.writeText(text),
        new Promise((_, reject) => setTimeout(() => reject(new Error('clipboard-timeout')), 1500)),
      ])
      return 'copied'
    }
  } catch {
    // fall through to the legacy path
  }

  // Legacy fallback: a hidden textarea + execCommand('copy'). Works where the
  // async Clipboard API is unavailable (older Safari, non-HTTPS origins).
  if (typeof document !== 'undefined') {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'absolute'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok ? 'copied' : 'error'
    } catch {
      return 'error'
    }
  }

  return 'error'
}
