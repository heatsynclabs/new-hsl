/**
 * HeatSync "Who's Here" check-in — CLASP wiring.
 *
 * Everything runs client-side against the public, open CLASP relay
 * (relay.clasp.to) — no server or auth required. The SDK is loaded from an ESM
 * CDN at runtime (see CHECKIN_SDK_URL) so nothing is bundled.
 *
 * Data model on the relay (all under CHECKIN_NS):
 *   • <ns>/present/<deviceId>  — a persistent param per checked-in device:
 *         { handle, host, since, until }   (handle === null => anonymous)
 *     Set on check-in; set to null on check-out. Subscribing to the wildcard
 *     replays a snapshot of everyone currently present, then streams changes.
 *   • <ns>/feed                — a single address that EMITS a CheckinFeedEvent
 *     on every check-in / check-out. This is the address integrations subscribe
 *     to: `c.on('/heatsynclabs/checkin/feed', cb)`.
 *
 * The relay is public and unauthenticated, so treat this as a community board:
 * data is world-readable and could be spoofed. Fine for "who's at the lab";
 * for anything sensitive, self-host a relay and swap CHECKIN_RELAY.
 */
export const CHECKIN_RELAY = 'wss://relay.clasp.to'
// jsdelivr's +esm bundle pins exact dep versions (the SDK was built against
// core@4.3.0), avoiding esm.sh's range-resolution export mismatch.
export const CHECKIN_SDK_URL = 'https://cdn.jsdelivr.net/npm/@clasp-to/sdk@4.5.0/+esm'
export const CHECKIN_NS = '/heatsynclabs/checkin'

export const CHECKIN_PRESENT_GLOB = `${CHECKIN_NS}/present/**`
export const checkinPresentAddr = (deviceId: string) => `${CHECKIN_NS}/present/${deviceId}`

/** Single address for integrations to subscribe to. */
export const CHECKIN_FEED = `${CHECKIN_NS}/feed`

/** Default time-to-live for a check-in, in hours. */
export const CHECKIN_DEFAULT_HOURS = 3
/** Duration presets (hours) offered in the UI. */
export const CHECKIN_DURATION_OPTIONS = [1, 2, 3, 4, 6, 8]

/** A person's presence record, stored at <ns>/present/<deviceId>. */
export interface PresenceValue {
  /** Display name, or null when checked in anonymously. */
  handle: string | null
  /** Whether this person is acting as a host / keyholder. */
  host: boolean
  /** Check-in time (epoch ms). */
  since: number
  /** Auto-expiry time (epoch ms) — the TTL the person set. */
  until: number
}

/** Event emitted on CHECKIN_FEED for every check-in / check-out. */
export interface CheckinFeedEvent extends PresenceValue {
  type: 'checkin' | 'checkout'
  id: string
}

const DEVICE_KEY = 'hsl-checkin-device'
const HANDLE_KEY = 'hsl-checkin-handle'

/** Stable per-device id (so re-checking-in updates the same slot). */
export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_KEY)
  if (!id) {
    id = (crypto.randomUUID?.() ?? `d-${Date.now()}-${Math.floor(Math.random() * 1e9)}`)
    localStorage.setItem(DEVICE_KEY, id)
  }
  return id
}

export function getSavedHandle(): string {
  return localStorage.getItem(HANDLE_KEY)?.trim() ?? ''
}

export function setSavedHandle(handle: string): void {
  const h = handle.trim()
  if (h) localStorage.setItem(HANDLE_KEY, h)
}

export function clearSavedHandle(): void {
  localStorage.removeItem(HANDLE_KEY)
}
