<template>
  <div
    class="carousel"
    :class="{ 'is-paused': paused }"
    @mouseenter="pause"
    @mouseleave="resume"
    @focusin="pause"
    @focusout="resume"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- Paper frame - the one "feature" object, so it earns the block shadow -->
    <div class="carousel__frame">
      <div class="carousel__stage">
        <img
          v-for="(photo, i) in images"
          :key="photo.src"
          :src="photo.src"
          :alt="`HeatSync Labs — ${photo.name}`"
          class="carousel__img"
          :class="{ 'is-active': i === index }"
          loading="lazy"
          draggable="false"
        />
      </div>

      <!-- auto-advance progress bar (resets each slide; pauses on hover) -->
      <div class="carousel__progress">
        <div class="carousel__progress-fill" :key="index"></div>
      </div>

      <!-- Caption bar -->
      <div class="carousel__bar">
        <span class="carousel__eyebrow">{{ images[index]?.name }}</span>
        <span class="carousel__count">{{ pad(index + 1) }} / {{ pad(images.length) }}</span>
      </div>
    </div>

    <!-- Controls - flat, no shadow -->
    <button class="carousel__btn carousel__btn--prev" @click="prev" aria-label="Previous photo">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <button class="carousel__btn carousel__btn--next" @click="next" aria-label="Next photo">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M9 18l6-6-6-6"/></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

type Photo = { src: string; name: string }

// Filenames live in /public/space-pics/. Keep the source list in plain
// human-readable form; we URL-encode for the <img src> and strip the extension
// for the caption.
const SPACE_PIC_FILES = [
  '3D Printing Station.webp',
  'All are welcome.webp',
  'Biohacking Lab.webp',
  'CRT Wall.webp',
  'Coffee and Books.webp',
  'Coworking.webp',
  'Dark Room Photography.webp',
  'Drill Press.webp',
  'Electronics.webp',
  'Entrance.webp',
  'Front Window.webp',
  'Front window 2.webp',
  'Jewlery Station.webp',
  'Laser Cutters.webp',
  'Machine Shop.webp',
  'Main Hall.webp',
  'Microcontrollers.webp',
  'Music Station.webp',
  'Sewing Station.webp',
  'Vinyl and Sublimation Station.webp',
  'Welding.webp',
  'Window Decor.webp',
  'Woodshop.webp',
]

const basePhotos: Photo[] = SPACE_PIC_FILES.map(f => ({
  src: `/space-pics/${encodeURIComponent(f)}`,
  name: f.replace(/\.[^.]+$/, ''),
}))

const images = ref<Photo[]>(basePhotos)
const index = ref(0)
const paused = ref(false)

const ROTATE_MS = 5000
let timer: number | null = null
let touchX = 0

const pad = (n: number) => String(n).padStart(2, '0')

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

const goTo = (i: number) => {
  index.value = (i + images.value.length) % images.value.length
  restart()
}
const next = () => goTo(index.value + 1)
const prev = () => goTo(index.value - 1)

const start = () => { timer = window.setInterval(() => { index.value = (index.value + 1) % images.value.length }, ROTATE_MS) }
const stop = () => { if (timer) { window.clearInterval(timer); timer = null } }
const restart = () => { stop(); if (!paused.value) start() }
const pause = () => { paused.value = true; stop() }
const resume = () => { paused.value = false; if (!timer) start() }

const onTouchStart = (e: TouchEvent) => { touchX = e.changedTouches[0]?.clientX ?? 0 }
const onTouchEnd = (e: TouchEvent) => {
  const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX
  if (Math.abs(dx) > 40) (dx < 0 ? next : prev)()
}

const preload = () => images.value.forEach(p => { const img = new Image(); img.src = p.src })

onMounted(() => {
  images.value = shuffle(basePhotos)
  preload()
  // Respect reduced-motion: don't auto-advance (users still have prev/next)
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduce) start()
})
onUnmounted(stop)
</script>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel__frame {
  position: relative;
  width: 100%;
  max-width: 560px;
  background: var(--paper-c);
  border: var(--border-thick);
  padding: 14px 14px 0;
}

:global([data-theme="dark"]) .carousel__frame {
  background: var(--ink);
  border-color: var(--paper-d);
}

.carousel__stage {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--ink-panel);
  border: 2px solid var(--ink);
}
:global([data-theme="dark"]) .carousel__stage { border-color: var(--ink-soft); }

.carousel__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.92) contrast(1.03);
  opacity: 0;
  transition: opacity 0.7s ease;
}
.carousel__img.is-active { opacity: 1; }

/* Auto-advance progress bar */
.carousel__progress {
  height: 4px;
  background: var(--paper-d);
  margin-top: 8px;
}
:global([data-theme="dark"]) .carousel__progress { background: var(--ink-soft); }
.carousel__progress-fill {
  height: 100%;
  width: 0;
  background: var(--orange);
  animation: carousel-progress 5s linear forwards;
}
.carousel.is-paused .carousel__progress-fill { animation-play-state: paused; }
@keyframes carousel-progress { from { width: 0; } to { width: 100%; } }
@media (prefers-reduced-motion: reduce) {
  .carousel__progress-fill { animation: none; width: 100%; }
}

.carousel__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  height: 42px;
  padding: 0 4px;
  font-family: var(--font-ui);
}

.carousel__eyebrow {
  font-size: var(--text-base);
  letter-spacing: 1px;
  color: var(--orange-d);
  text-transform: uppercase;
  min-width: 0;
  flex: 1 1 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
:global([data-theme="dark"]) .carousel__eyebrow { color: var(--orange); }

.carousel__count {
  flex: 0 0 auto;
  font-size: var(--text-lg);
  letter-spacing: 2px;
  color: var(--ink);
}
:global([data-theme="dark"]) .carousel__count { color: var(--paper-d); }

/* Prev / next - flat ink squares, thick border, no shadow */
.carousel__btn {
  position: absolute;
  top: 42%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ink);
  color: var(--paper);
  border: 3px solid var(--ink);
  cursor: pointer;
  z-index: 7;
  transition: background var(--transition-fast), color var(--transition-fast);
}
:global([data-theme="dark"]) .carousel__btn { background: var(--paper); color: var(--ink); border-color: var(--paper); }
.carousel__btn svg { width: 22px; height: 22px; }
.carousel__btn:hover { background: var(--orange); color: var(--ink); border-color: var(--ink); }
.carousel__btn--prev { left: -14px; }
.carousel__btn--next { right: -14px; }

@media (max-width: 900px) {
  .carousel__frame { max-width: 460px; }
}

@media (max-width: 600px) {
  .carousel__btn { width: 38px; height: 38px; }
  .carousel__btn--prev { left: -8px; }
  .carousel__btn--next { right: -8px; }
  .carousel__eyebrow { font-size: var(--text-sm); letter-spacing: 1px; }
  .carousel__count { font-size: var(--text-base); }
}
</style>
