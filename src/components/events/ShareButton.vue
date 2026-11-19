<template>
  <button
    type="button"
    class="share-btn"
    :class="{ 'share-btn--done': state !== 'idle' }"
    :aria-label="ariaLabel"
    @click.stop="onClick"
  >
    <svg v-if="state !== 'idle'" class="share-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <!-- check glyph -->
      <polyline points="20 6 9 17 4 12" />
    </svg>
    <svg v-else-if="nativeShare" class="share-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <!-- share-nodes glyph -->
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
    <svg v-else class="share-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <!-- link glyph -->
      <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07l-1.41 1.41" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-2.83 2.83a5 5 0 0 0 7.07 7.07l1.41-1.41" />
    </svg>
    <span class="share-btn__label">{{ labelText }}</span>
    <!-- Announce the result to assistive tech without moving focus. -->
    <span class="sr-only" role="status" aria-live="polite">{{ liveText }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import type { CalendarEvent } from '../../services/calendarService'
import { eventShareUrl, shareOrCopy, canNativeShare, type ShareResult } from '../../utils/eventShare'

const props = withDefaults(defineProps<{
  event: CalendarEvent
  /** Resting label on desktop (defaults to "Copy link"). Touch devices show "Share". */
  label?: string
}>(), {
  label: 'Copy link',
})

type State = 'idle' | ShareResult
const state = ref<State>('idle')
// Decided on the client at mount: touch devices get the native share sheet and
// a "Share" label; desktop copies the link. Starts false so SSR/first paint
// shows the predictable "Copy link".
const nativeShare = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined

const restLabel = computed(() => (nativeShare.value ? 'Share' : props.label))

const labelText = computed(() => {
  switch (state.value) {
    case 'copied': return 'Link copied'
    case 'shared': return 'Shared'
    case 'error': return 'Copy failed'
    default: return restLabel.value
  }
})

const liveText = computed(() => (state.value === 'idle' ? '' : labelText.value))

const ariaLabel = computed(() => `${restLabel.value}: this event`)

onMounted(() => {
  nativeShare.value = canNativeShare()
})

const onClick = async () => {
  const url = eventShareUrl(props.event.id)
  const title = props.event.displayTitle || props.event.title
  state.value = await shareOrCopy(title, url)
  if (resetTimer) clearTimeout(resetTimer)
  // "Shared" via the native sheet needs no lingering confirmation; the copy
  // confirmation stays a touch longer so it is readable.
  resetTimer = setTimeout(() => { state.value = 'idle' }, state.value === 'shared' ? 1200 : 2200)
}

onBeforeUnmount(() => {
  if (resetTimer) clearTimeout(resetTimer)
})
</script>

<style scoped>
.share-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  background: transparent;
  border: 2px solid var(--color-border);
  padding: var(--space-2) var(--space-3);
  cursor: pointer;
  transition: color var(--transition-base), border-color var(--transition-base), background var(--transition-base);
  line-height: 1.2;
}

.share-btn:hover {
  color: var(--color-text-primary);
  border-color: var(--color-accent-primary);
}

.share-btn--done {
  color: var(--live);
  border-color: var(--live);
}

.share-btn__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
</style>
