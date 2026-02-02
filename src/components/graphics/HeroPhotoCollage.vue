<template>
  <div class="photo-collage" @click.self="expandedIndex = null">
    <!-- Expanded overlay -->
    <div v-if="expandedIndex !== null" class="expanded-overlay" @click="expandedIndex = null">
      <img
        :src="photos[expandedIndex]?.currentImage"
        :alt="`Workshop photo ${expandedIndex + 1}`"
        class="expanded-image"
        @click="expandedIndex = null"
      />
    </div>

    <div
      v-for="(photo, index) in visiblePhotos"
      :key="`photo-${index}`"
      class="photo"
      :style="photoStyles[index]"
      :class="[
        { 'torn-top': tornTops.includes(index) },
        { 'torn-bottom': tornBottoms.includes(index) }
      ]"
      @click="expandedIndex = index"
    >
      <div v-if="tapeSlots.includes(index)" class="tape" :style="tapeStyle(index)"></div>
      <div class="photo-stack">
        <img
          class="photo-current"
          :src="photo.currentImage"
          :alt="`Workshop photo ${index + 1}`"
        />
        <img
          class="photo-next"
          :ref="el => { if (el) nextImgRefs[index] = el as HTMLImageElement }"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface PhotoSlot {
  currentImage: string
}

interface PhotoPosition {
  left: number
  top: number
  width: number
  rotation: number
  zIndex: number
}

const allImages = Array.from({ length: 21 }, (_, i) => `/pics/${i + 1}.webp`)

const SLOT_COUNT = 6
const photos = ref<PhotoSlot[]>([])
const expandedIndex = ref<number | null>(null)
const positions = ref<PhotoPosition[]>([])
const nextImgRefs = ref<Record<number, HTMLImageElement>>({})
let usedImages: string[] = [] // track what's currently shown to avoid repeats

const tornTops = [1, 4]
const tornBottoms = [0, 3]
const tapeSlots = [0, 2, 5]

const visiblePhotos = computed(() => photos.value)

const shuffleArray = <T,>(arr: T[]): T[] => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Generate evenly scattered positions that stay within bounds
const generatePositions = (): PhotoPosition[] => {
  // 3 columns x 2 rows grid with jitter for organic feel
  const cols = 3
  const rows = 2
  const cellW = 100 / cols
  const cellH = 100 / rows

  const slots: PhotoPosition[] = []

  const cells: { col: number; row: number }[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ col: c, row: r })
    }
  }

  const shuffledCells = shuffleArray(cells)

  for (let i = 0; i < SLOT_COUNT; i++) {
    const cell = shuffledCells[i]
    const baseLeft = cell.col * cellW
    const baseTop = cell.row * cellH

    // Image width: 38-48% — large but contained
    const width = 38 + Math.random() * 10

    // Aspect ratio ~4:3, so height in % is roughly width * 0.75
    const approxHeight = width * 0.75

    // Jitter within cell
    const jitterX = (Math.random() - 0.5) * cellW * 0.4
    const jitterY = (Math.random() - 0.5) * cellH * 0.35

    // Clamp so image stays within 0-100% bounds
    const left = Math.max(0, Math.min(100 - width, baseLeft + jitterX))
    const top = Math.max(0, Math.min(100 - approxHeight, baseTop + jitterY))

    const rotation = (Math.random() - 0.5) * 10 // -5 to +5 degrees
    const zIndex = Math.floor(Math.random() * 10) + 1

    slots.push({ left, top, width, rotation, zIndex })
  }

  return slots
}

const photoStyles = computed(() => {
  return positions.value.map(pos => ({
    left: `${pos.left}%`,
    top: `${pos.top}%`,
    width: `${pos.width}%`,
    transform: `rotate(${pos.rotation}deg)`,
    zIndex: pos.zIndex
  }))
})

const tapeStyle = (index: number) => {
  const rotation = (Math.random() - 0.5) * 8
  const widths = [45, 40, 50]
  const w = widths[tapeSlots.indexOf(index)] || 42
  return {
    width: `${w}px`,
    top: '-7px',
    left: `${20 + Math.random() * 40}%`,
    transform: `rotate(${rotation}deg)`
  }
}

// Pick 6 random images, avoiding the currently displayed set
const pickNewImages = (): string[] => {
  const available = allImages.filter(img => !usedImages.includes(img))
  const shuffled = shuffleArray(available.length >= SLOT_COUNT ? available : allImages)
  const picked = shuffled.slice(0, SLOT_COUNT)
  usedImages = picked
  return picked
}

const initPhotos = () => {
  const picked = pickNewImages()
  photos.value = picked.map(img => ({ currentImage: img }))
  positions.value = generatePositions()
}

let cycleInterval: number | null = null

// Single cycle: crossfade ALL images + re-scatter layout
const doCycle = () => {
  const newImages = pickNewImages()

  // Crossfade all slots simultaneously
  let loaded = 0
  newImages.forEach((src, index) => {
    const nextImg = nextImgRefs.value[index]
    if (!nextImg) {
      loaded++
      return
    }
    nextImg.onload = () => {
      nextImg.style.visibility = 'visible'
      nextImg.style.opacity = '1'
      loaded++

      // Once all have faded in, swap the underlying images
      if (loaded === SLOT_COUNT) {
        setTimeout(() => {
          photos.value.forEach((photo, i) => {
            photo.currentImage = newImages[i]
            const img = nextImgRefs.value[i]
            if (img) {
              img.style.opacity = '0'
              img.style.visibility = 'hidden'
            }
          })
        }, 800)
      }
    }
    nextImg.src = src
  })

  // Re-scatter positions at the same time
  positions.value = generatePositions()
}

const startCycle = () => {
  cycleInterval = window.setInterval(doCycle, 8000)
}

const stopCycle = () => {
  if (cycleInterval) { window.clearInterval(cycleInterval); cycleInterval = null }
}

onMounted(() => {
  initPhotos()
  startCycle()
})

onUnmounted(() => {
  stopCycle()
})
</script>

<style scoped>
.photo-collage {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.photo {
  position: absolute;
  background: var(--color-bg-secondary);
  padding: 5px;
  box-shadow:
    2px 2px 8px var(--shadow-light),
    4px 4px 16px var(--shadow-medium);
  transition:
    left 1.6s cubic-bezier(0.4, 0, 0.2, 1),
    top 1.6s cubic-bezier(0.4, 0, 0.2, 1),
    width 1.6s cubic-bezier(0.4, 0, 0.2, 1),
    transform 1.6s cubic-bezier(0.4, 0, 0.2, 1),
    filter 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}

.photo:hover {
  z-index: 100 !important;
  filter: brightness(1.05);
  box-shadow: 6px 6px 20px var(--shadow-medium);
}

.photo-stack {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.9) contrast(1.02);
}

.photo-current {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.photo-next {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.8s ease;
}

.photo.torn-top img {
  clip-path: polygon(
    0% 4%, 10% 0%, 20% 3%, 30% 1%, 40% 4%, 50% 0%, 60% 3%, 70% 1%, 80% 4%, 90% 0%, 100% 3%,
    100% 100%, 0% 100%
  );
}

.photo.torn-bottom img {
  clip-path: polygon(
    0% 0%, 100% 0%,
    100% 96%, 90% 100%, 80% 97%, 70% 100%, 60% 96%, 50% 100%, 40% 97%, 30% 100%, 20% 96%, 10% 100%, 0% 97%
  );
}

/* Expanded photo overlay — stays within collage container */
.expanded-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 20px;
  border-radius: 2px;
}

.expanded-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: var(--radius-base);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

/* Tape */
.tape {
  position: absolute;
  height: 16px;
  background: var(--highlight);
  opacity: 0.9;
  z-index: 10;
}

.tape::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 3px,
    rgba(0,0,0,0.04) 3px,
    rgba(0,0,0,0.04) 6px
  );
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .photo {
    padding: 4px;
  }

  .tape {
    height: 12px;
  }

  .expanded-overlay {
    padding: var(--space-4);
  }
}

@media (max-width: 480px) {
  .photo {
    padding: 3px;
  }

  .tape {
    height: 10px;
  }
}
</style>
