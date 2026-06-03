<template>
  <section class="ci">
    <header class="ci__head">
      <div class="ci__head-row">
        <h1 class="ci__title">Who's Here</h1>
        <span class="ci__conn" :class="`ci__conn--${status}`">
          <span class="ci__conn-dot"></span>
          {{ statusLabel }}
        </span>
      </div>
      <p class="ci__sub">
        Tap in to let the community know you're at the lab. Auto‑expires when your
        time's up — so it's still right even if you close your laptop.
      </p>
    </header>

    <div class="ci__grid">
      <!-- ---------------- Check-in panel ---------------- -->
      <div class="ci__panel">
        <!-- Already checked in -->
        <div v-if="myCheckin" class="ci__active">
          <span class="ci__active-eyebrow">You're checked in</span>
          <p class="ci__active-name">
            {{ myCheckin.handle || 'Anonymous' }}
            <span v-if="myCheckin.host" class="ci__hosttag">Host</span>
          </p>
          <p class="ci__active-until">Here until <strong>{{ fmtTime(myCheckin.until) }}</strong></p>
          <div class="ci__active-actions">
            <button type="button" class="ci__btn ci__btn--ghost" @click="extend(1)">+1 hour</button>
            <button type="button" class="ci__btn ci__btn--ghost" @click="extend(2)">+2 hours</button>
            <button type="button" class="ci__btn ci__btn--out" @click="checkOut()">Check out</button>
          </div>
        </div>

        <!-- Not checked in -->
        <template v-else>
          <!-- Quick check-in (saved handle) -->
          <div v-if="savedHandle" class="ci__quick">
            <span class="ci__quick-eyebrow">Welcome back, {{ savedHandle }}</span>
            <div class="ci__quick-row">
              <button type="button" class="ci__btn ci__btn--primary" :disabled="!ready" @click="quick('me')">
                Check in
              </button>
              <button type="button" class="ci__btn ci__btn--host" :disabled="!ready" @click="quick('host')">
                As host
              </button>
              <button type="button" class="ci__btn ci__btn--ghost" :disabled="!ready" @click="quick('anon')">
                Anonymous
              </button>
            </div>
            <button type="button" class="ci__forget" @click="forget()">Not you? Forget name</button>
          </div>

          <div v-if="savedHandle" class="ci__divider"><span>or set details</span></div>

          <!-- Full form -->
          <form class="ci__form" @submit.prevent="submitForm()">
            <label class="ci__field">
              <span class="ci__label">Name <span class="ci__opt">(optional)</span></span>
              <input
                v-model.trim="name"
                type="text"
                class="ci__input"
                maxlength="32"
                placeholder="Your name or handle"
                :disabled="anon"
                autocomplete="nickname"
              />
            </label>

            <div class="ci__toggles">
              <button
                type="button"
                class="ci__toggle"
                :class="{ active: anon }"
                :aria-pressed="anon"
                @click="anon = !anon"
              >
                <span class="ci__toggle-box"></span> Anonymous
              </button>
              <button
                type="button"
                class="ci__toggle"
                :class="{ active: host }"
                :aria-pressed="host"
                @click="host = !host"
              >
                <span class="ci__toggle-box"></span> I'm a host
              </button>
            </div>

            <div class="ci__field">
              <span class="ci__label">Here for</span>
              <div class="ci__durations">
                <button
                  v-for="h in durationOptions"
                  :key="h"
                  type="button"
                  class="ci__dur"
                  :class="{ active: hours === h }"
                  @click="hours = h"
                >{{ h }}h</button>
              </div>
              <span v-if="mounted" class="ci__until-hint">until {{ fmtTime(nowTs + hours * 3600000) }}</span>
            </div>

            <button type="submit" class="ci__btn ci__btn--primary ci__btn--block" :disabled="!ready">
              {{ ready ? 'Check In' : 'Connecting…' }}
            </button>
            <p v-if="status === 'offline'" class="ci__error">
              Live check‑in is offline right now — try again in a moment.
            </p>
          </form>
        </template>
      </div>

      <!-- ---------------- Who's here ---------------- -->
      <div class="ci__present">
        <div class="ci__present-head">
          <h2 class="ci__present-title">Here Now</h2>
          <span class="ci__count">{{ activePresent.length }}</span>
        </div>

        <p v-if="status === 'connecting'" class="ci__present-state">Loading…</p>
        <p v-else-if="activePresent.length === 0" class="ci__present-state">
          No one's checked in right now.
        </p>
        <ul v-else class="ci__people" role="list">
          <li
            v-for="p in activePresent"
            :key="p.id"
            class="ci__person"
            :class="{ 'ci__person--host': p.host, 'ci__person--me': p.id === deviceId }"
          >
            <span class="ci__person-name">
              {{ p.handle || 'Anonymous' }}
              <span v-if="p.id === deviceId" class="ci__metag">you</span>
            </span>
            <span class="ci__person-meta">
              <span v-if="p.host" class="ci__hosttag">Host</span>
              <span class="ci__person-time">til {{ fmtTime(p.until) }}</span>
            </span>
          </li>
        </ul>

        <p class="ci__hosts" v-if="hostCount > 0">
          {{ hostCount }} host{{ hostCount === 1 ? '' : 's' }} on duty
        </p>
      </div>
    </div>

    <p class="ci__dev">
      Building an integration? Subscribe to <code>{{ feedAddr }}</code> on
      <code>relay.clasp.to</code> to get a CLASP event on every check‑in.
    </p>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { format } from 'date-fns'
import {
  CHECKIN_RELAY, CHECKIN_SDK_URL, CHECKIN_PRESENT_GLOB, CHECKIN_FEED,
  checkinPresentAddr, getDeviceId, getSavedHandle, setSavedHandle, clearSavedHandle,
  CHECKIN_DEFAULT_HOURS, CHECKIN_DURATION_OPTIONS,
  type PresenceValue, type CheckinFeedEvent,
} from '../../utils/checkin'

type Status = 'connecting' | 'online' | 'offline'

const status = ref<Status>('connecting')
const mounted = ref(false)
const deviceId = ref('')
const savedHandle = ref('')
const present = reactive<Record<string, PresenceValue>>({})
const nowTs = ref(Date.now())

// form state
const name = ref('')
const anon = ref(false)
const host = ref(false)
const hours = ref(CHECKIN_DEFAULT_HOURS)
const durationOptions = CHECKIN_DURATION_OPTIONS
const feedAddr = CHECKIN_FEED

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: any = null
let unsub: (() => void) | null = null
let nowTimer: ReturnType<typeof setInterval> | undefined
let sweepTimer: ReturnType<typeof setInterval> | undefined

const ready = computed(() => status.value === 'online')

const statusLabel = computed(() =>
  status.value === 'online' ? 'Live' : status.value === 'connecting' ? 'Connecting' : 'Offline'
)

const activePresent = computed(() =>
  Object.entries(present)
    .map(([id, v]) => ({ id, ...v }))
    .filter(p => p && p.until > nowTs.value)
    .sort((a, b) => (Number(b.host) - Number(a.host)) || (a.since - b.since))
)

const hostCount = computed(() => activePresent.value.filter(p => p.host).length)

const myCheckin = computed<PresenceValue | null>(() => {
  const v = present[deviceId.value]
  return v && v.until > nowTs.value ? v : null
})

const fmtTime = (ms: number) => format(new Date(ms), 'h:mm a')

// ---- relay actions ----
const writeCheckin = async (value: PresenceValue, type: CheckinFeedEvent['type']) => {
  if (!client) return
  const addr = checkinPresentAddr(deviceId.value)
  await client.set(addr, type === 'checkout' ? null : value)
  if (type === 'checkout') delete present[deviceId.value]
  else present[deviceId.value] = value
  // Fire the single integration event (best-effort).
  client.emit(CHECKIN_FEED, { type, id: deviceId.value, ...value } satisfies CheckinFeedEvent)
    .catch(() => {})
}

const doCheckIn = async (handle: string | null, isHost: boolean) => {
  if (!ready.value) return
  const now = Date.now()
  const value: PresenceValue = { handle, host: isHost, since: now, until: now + hours.value * 3600000 }
  try {
    await writeCheckin(value, 'checkin')
    if (handle) { setSavedHandle(handle); savedHandle.value = handle }
  } catch (e) {
    console.error('check-in failed', e)
    status.value = 'offline'
  }
}

const quick = (mode: 'me' | 'host' | 'anon') =>
  doCheckIn(mode === 'anon' ? null : savedHandle.value, mode === 'host')

const submitForm = () => doCheckIn(anon.value ? null : (name.value.trim() || null), host.value)

const extend = async (addHours: number) => {
  const cur = present[deviceId.value]
  if (!cur) return
  const value: PresenceValue = { ...cur, until: Date.now() + addHours * 3600000 }
  try { await writeCheckin(value, 'checkin') } catch (e) { console.error(e) }
}

const checkOut = async () => {
  const cur = present[deviceId.value]
  if (!cur) return
  try { await writeCheckin(cur, 'checkout') } catch (e) { console.error(e) }
}

const forget = () => { clearSavedHandle(); savedHandle.value = '' }

// Opportunistic housekeeping: clear entries that expired a while ago so the
// public namespace doesn't accumulate stale params (idempotent on the relay).
const sweep = () => {
  if (!client) return
  const cutoff = Date.now() - 5 * 60 * 1000
  for (const [id, v] of Object.entries(present)) {
    if (v && v.until < cutoff) {
      client.set(checkinPresentAddr(id), null).catch(() => {})
      delete present[id]
    }
  }
}

onMounted(async () => {
  mounted.value = true
  deviceId.value = getDeviceId()
  savedHandle.value = getSavedHandle()
  name.value = savedHandle.value
  nowTimer = setInterval(() => { nowTs.value = Date.now() }, 20000)

  try {
    // Load the SDK from the CDN at runtime (kept out of the bundle).
    const mod = await import(/* @vite-ignore */ CHECKIN_SDK_URL)
    const clasp = mod.default ?? mod.clasp
    client = await Promise.race([
      clasp(CHECKIN_RELAY, { name: 'HeatSync Labs check-in' }),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 9000)),
    ])
    unsub = client.on(CHECKIN_PRESENT_GLOB, (val: PresenceValue | null, addr: string) => {
      const id = addr.slice(addr.lastIndexOf('/') + 1)
      if (val == null) delete present[id]
      else present[id] = val
    })
    status.value = 'online'
    sweepTimer = setInterval(sweep, 90000)
  } catch (e) {
    console.error('Check-in relay unavailable:', e)
    status.value = 'offline'
  }
})

onBeforeUnmount(() => {
  clearInterval(nowTimer)
  clearInterval(sweepTimer)
  try { unsub?.() } catch { /* ignore */ }
  try { client?.close?.() } catch { /* ignore */ }
})
</script>

<style scoped>
.ci {
  flex: 1;
}

.ci__head {
  margin-bottom: var(--space-8);
}

.ci__head-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.ci__title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(34px, 6vw, 56px);
  text-transform: uppercase;
  letter-spacing: -0.01em;
  line-height: 1;
  color: var(--color-text-primary);
  margin: 0;
}

.ci__conn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 5px 10px;
  border: 2px solid var(--steel-hi);
  color: var(--smoke);
}

.ci__conn-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--smoke);
}

.ci__conn--online { border-color: var(--live); color: var(--live); }
.ci__conn--online .ci__conn-dot { background: var(--live); }
.ci__conn--connecting .ci__conn-dot { background: var(--hazard); animation: ci-pulse 1.2s ease-in-out infinite; }
.ci__conn--offline { border-color: var(--fault); color: var(--fault); }
.ci__conn--offline .ci__conn-dot { background: var(--fault); }

@keyframes ci-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

.ci__sub {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  color: var(--ash);
  line-height: var(--leading-relaxed);
  max-width: 60ch;
  margin: var(--space-3) 0 0;
}

.ci__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: var(--space-6);
  align-items: start;
}

/* ---------- panel (shared card look) ---------- */
.ci__panel,
.ci__present {
  background: var(--slab);
  border: 2px solid var(--steel-hi);
  box-shadow: var(--shadow-sm);
  padding: var(--space-6);
}

/* active / checked-in */
.ci__active-eyebrow,
.ci__quick-eyebrow {
  display: block;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-text);
  margin-bottom: var(--space-2);
}

.ci__active-name {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(24px, 3.4vw, 34px);
  text-transform: uppercase;
  letter-spacing: -0.01em;
  line-height: 1;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.ci__active-until {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--ash);
  margin: 0 0 var(--space-5);
}
.ci__active-until strong { color: var(--accent-text); }

.ci__active-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

/* quick */
.ci__quick-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.ci__forget {
  margin-top: var(--space-3);
  background: none;
  border: none;
  padding: 0;
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--smoke);
  cursor: pointer;
}
.ci__forget:hover { color: var(--accent-text); }

.ci__divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: var(--space-5) 0;
  font-family: var(--font-ui);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--smoke);
}
.ci__divider::before,
.ci__divider::after {
  content: '';
  flex: 1;
  border-top: 1px dashed var(--steel);
}
.ci__divider span { padding: 0 var(--space-3); }

/* form */
.ci__form { display: flex; flex-direction: column; gap: var(--space-5); }

.ci__field { display: flex; flex-direction: column; gap: var(--space-2); }

.ci__label {
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--smoke);
}
.ci__opt { color: var(--steel-hi); }

.ci__input {
  font-family: var(--font-body);
  font-size: var(--text-base);
  padding: 12px 14px;
  background: var(--char);
  border: 2px solid var(--steel-hi);
  color: var(--color-text-primary);
}
.ci__input:focus { outline: none; border-color: var(--hazard); }
.ci__input:disabled { opacity: 0.4; }

.ci__toggles { display: flex; flex-wrap: wrap; gap: var(--space-3); }

.ci__toggle {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 10px 14px;
  background: transparent;
  border: 2px solid var(--steel-hi);
  color: var(--ash);
  cursor: pointer;
  transition: color var(--transition-fast), border-color var(--transition-fast);
}
.ci__toggle-box {
  width: 14px;
  height: 14px;
  border: 2px solid var(--steel-hi);
  flex-shrink: 0;
}
.ci__toggle.active { color: var(--accent-text); border-color: var(--hazard); }
.ci__toggle.active .ci__toggle-box { background: var(--hazard); border-color: var(--hazard); }

.ci__durations { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.ci__dur {
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 9px 16px;
  background: transparent;
  border: 2px solid var(--steel-hi);
  color: var(--ash);
  cursor: pointer;
  transition: color var(--transition-fast), border-color var(--transition-fast), background-color var(--transition-fast);
}
.ci__dur:hover { color: var(--accent-text); }
.ci__dur.active { background: var(--hazard); color: var(--tape-dark); border-color: var(--hazard); }

.ci__until-hint {
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--smoke);
}

/* buttons */
.ci__btn {
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 13px 22px;
  border: 2px solid var(--tape-dark);
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
}
.ci__btn:disabled { opacity: 0.5; cursor: not-allowed; }

.ci__btn--primary {
  background: var(--hazard);
  color: var(--tape-dark);
  box-shadow: var(--shadow-sm);
}
.ci__btn--primary:not(:disabled):hover { transform: translate(-2px, -2px); box-shadow: var(--shadow); }

.ci__btn--host {
  background: var(--rust);
  color: var(--on-dark);
  box-shadow: var(--shadow-sm);
}
.ci__btn--host:not(:disabled):hover { transform: translate(-2px, -2px); box-shadow: var(--shadow); }

.ci__btn--ghost {
  background: transparent;
  color: var(--color-text-primary);
  border-color: var(--steel-hi);
}
.ci__btn--ghost:not(:disabled):hover { border-color: var(--hazard); color: var(--accent-text); }

.ci__btn--out {
  background: transparent;
  color: var(--fault);
  border-color: var(--fault);
}
.ci__btn--out:hover { background: var(--fault); color: var(--on-dark); }

.ci__btn--block { width: 100%; }

.ci__error {
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--fault);
  margin: 0;
}

/* ---------- who's here ---------- */
.ci__present-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 2px solid var(--steel-hi);
  padding-bottom: var(--space-3);
  margin-bottom: var(--space-3);
}
.ci__present-title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: var(--text-2xl);
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  margin: 0;
}
.ci__count {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(28px, 5vw, 44px);
  line-height: 1;
  color: var(--accent-text);
}

.ci__present-state {
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--smoke);
  padding: var(--space-5) 0;
  text-align: center;
}

.ci__people { list-style: none; margin: 0; padding: 0; }
.ci__person {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: 12px 0;
  border-bottom: 1px dashed var(--steel);
  border-left: 4px solid transparent;
  padding-left: 10px;
  margin-left: -10px;
}
.ci__person:last-child { border-bottom: none; }
.ci__person--host { border-left-color: var(--rust); }
.ci__person--me { border-left-color: var(--hazard); }

.ci__person-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 17px;
  color: var(--color-text-primary);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  overflow-wrap: anywhere;
}

.ci__person-meta { display: inline-flex; align-items: center; gap: 10px; flex-shrink: 0; }
.ci__person-time {
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--smoke);
  white-space: nowrap;
}

.ci__hosttag {
  font-family: var(--font-ui);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--rust);
  color: var(--on-dark);
  padding: 2px 6px;
}
.ci__metag {
  font-family: var(--font-ui);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--hazard);
  color: var(--tape-dark);
  padding: 2px 6px;
}

.ci__hosts {
  margin: var(--space-4) 0 0;
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--smoke);
}

.ci__dev {
  margin: var(--space-8) 0 0;
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--smoke);
}
.ci__dev code {
  font-family: var(--font-mono);
  color: var(--accent-text);
  background: var(--char);
  padding: 1px 5px;
  border: 1px solid var(--steel);
}

@media (max-width: 800px) {
  .ci__grid { grid-template-columns: 1fr; }
}
</style>
