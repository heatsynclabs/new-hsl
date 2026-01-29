<template>
  <div class="photo-collage">
    <div
      v-for="(photo, index) in photos"
      :key="`photo-${index}`"
      :class="[
        'photo',
        `photo-${index + 1}`,
        { 'torn-top': tornTops.includes(index + 1) },
        { 'torn-bottom': tornBottoms.includes(index + 1) }
      ]"
      @click="handlePhotoClick(index)"
    >
      <div v-if="tapes.includes(index + 1)" class="tape"></div>
      <div class="photo-stack">
        <!-- Render ALL images upfront, use CSS to show/hide -->
        <img
          v-for="(imgUrl, imgIndex) in photo.images"
          :key="`photo-${index}-img-${imgIndex}`"
          :src="imgUrl"
          :alt="`Workshop activity ${index + 1}`"
          :class="['photo-img', { active: imgIndex === photo.currentIndex }]"
          loading="lazy"
        />
      </div>
      <div v-if="scribbles[index + 1]" class="scribble">{{ scribbles[index + 1] }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { FlickrService, type FlickrPhoto } from '../../services/flickrService'

interface PhotoItem {
  images: string[]
  currentIndex: number
}

const flickrService = new FlickrService()
const photos = ref<PhotoItem[]>([])
const tornTops = [2, 5]
const tornBottoms = [1, 4]
const tapes = [1, 3, 5]
const scribbles: Record<number, string> = {}

let rotationIntervals: number[] = []
let isMobile = false
let allFetchedPhotos: FlickrPhoto[] = []  // Store all fetched photo metadata
let hasLoadedMorePhotos = false

// Shuffle array (Fisher-Yates)
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Pick N random items from an array
const pickRandom = <T>(array: T[], count: number): T[] => {
  const shuffled = shuffleArray(array)
  return shuffled.slice(0, count)
}

// Check if mobile (matches CSS breakpoint)
const checkMobile = () => {
  if (typeof window !== 'undefined') {
    isMobile = window.innerWidth <= 900
  }
}

// Handle tap/click on photos (for mobile)
const handlePhotoClick = (index: number) => {
  if (!isMobile) return // Only handle on mobile
  const photo = photos.value[index]
  if (photo && photo.images.length > 1) {
    photo.currentIndex = (photo.currentIndex + 1) % photo.images.length
  }
}

// Build photo groups from a set of photos
const buildPhotoGroups = (photoList: FlickrPhoto[]): PhotoItem[] => {
  const photoGroups: PhotoItem[] = []
  const numGroups = 5
  const photosPerGroup = Math.ceil(photoList.length / numGroups)

  for (let i = 0; i < numGroups; i++) {
    const startIdx = i * photosPerGroup
    const groupImages = photoList.slice(startIdx, startIdx + photosPerGroup).map(p => p.url)

    if (groupImages.length > 0) {
      photoGroups.push({
        images: groupImages,
        currentIndex: Math.floor(Math.random() * groupImages.length)
      })
    }
  }

  // Fill with placeholders if needed
  while (photoGroups.length < 5) {
    photoGroups.push({
      images: ['/hsl-logo.png'],
      currentIndex: 0
    })
  }

  return photoGroups
}

// Add more photos to existing groups
const addMorePhotos = (newPhotos: FlickrPhoto[]) => {
  if (newPhotos.length === 0) return

  const photosPerGroup = Math.ceil(newPhotos.length / 5)

  photos.value.forEach((group, index) => {
    const startIdx = index * photosPerGroup
    const newImages = newPhotos.slice(startIdx, startIdx + photosPerGroup).map(p => p.url)
    // Add new images to the group
    group.images = [...group.images, ...newImages]
  })
}

const initPhotos = async () => {
  try {
    checkMobile()

    // Fetch photo metadata from Flickr API (we'll only render some initially)
    allFetchedPhotos = await flickrService.getPhotos(50, '')

    if (allFetchedPhotos.length === 0) {
      throw new Error('No photos found')
    }

    // Shuffle all photos
    allFetchedPhotos = shuffleArray(allFetchedPhotos)

    // Start with first 10 random photos (2 per group)
    const initialPhotos = allFetchedPhotos.slice(0, 10)
    photos.value = buildPhotoGroups(initialPhotos)

    // Only start rotations on desktop
    if (!isMobile) {
      startRotations()

      // After 8 seconds, load 10 more photos (total 20, 4 per group)
      setTimeout(() => {
        if (!hasLoadedMorePhotos && allFetchedPhotos.length > 10) {
          hasLoadedMorePhotos = true
          const morePhotos = allFetchedPhotos.slice(10, 20)
          addMorePhotos(morePhotos)
        }
      }, 8000)
    }
  } catch (error) {
    console.error('Failed to load photos:', error)
    // Use placeholder images
    photos.value = Array(5).fill(null).map(() => ({
      images: ['/hsl-logo.png'],
      currentIndex: 0
    }))
  }
}

const startRotations = () => {
  // Stagger the start of each photo's rotation
  photos.value.forEach((photo, index) => {
    if (photo.images.length <= 1) return

    const delay = index * 1800

    setTimeout(() => {
      const intervalId = window.setInterval(() => {
        // Simply update the currentIndex - Vue reactivity handles the rest
        // No src changes, no network requests!
        photo.currentIndex = (photo.currentIndex + 1) % photo.images.length
      }, 4500 + (index * 400))

      rotationIntervals.push(intervalId)
    }, delay)
  })
}

const stopRotations = () => {
  rotationIntervals.forEach(id => window.clearInterval(id))
  rotationIntervals = []
}

onMounted(() => {
  initPhotos()
})

onUnmounted(() => {
  stopRotations()
})
</script>

<style scoped>
.photo-collage {
  position: relative;
  width: 100%;
  height: 100%;
}

.photo {
  position: absolute;
  background: var(--cream);
  padding: 5px;
  box-shadow:
    2px 2px 8px var(--shadow-light),
    4px 4px 16px var(--shadow-medium);
  transition: transform 0.4s ease, opacity 0.5s ease;
  cursor: pointer;
}

.photo:hover {
  z-index: 100 !important;
  transform: scale(1.08) rotate(0deg) translate(-2px, -2px) !important;
  box-shadow: 6px 6px 20px var(--shadow-medium);
}

.photo-stack {
  position: relative;
  width: 100%;
  height: 100%;
}

.photo-img {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.9) contrast(1.02);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.photo-img.active {
  opacity: 1;
  z-index: 1;
}

.photo.torn-top .photo-img {
  clip-path: polygon(
    0% 4%, 10% 0%, 20% 3%, 30% 1%, 40% 4%, 50% 0%, 60% 3%, 70% 1%, 80% 4%, 90% 0%, 100% 3%,
    100% 100%, 0% 100%
  );
}

.photo.torn-bottom .photo-img {
  clip-path: polygon(
    0% 0%, 100% 0%,
    100% 96%, 90% 100%, 80% 97%, 70% 100%, 60% 96%, 50% 100%, 40% 97%, 30% 100%, 20% 96%, 10% 100%, 0% 97%
  );
}

.photo-1 {
  width: 44%;
  height: 40%;
  top: 0;
  left: 0;
  animation: drift1 8s ease-in-out infinite;
}

.photo-2 {
  width: 40%;
  height: 44%;
  top: 2%;
  right: 5%;
  animation: drift2 9s ease-in-out infinite;
}

.photo-3 {
  width: 32%;
  height: 32%;
  top: 34%;
  left: 30%;
  z-index: 10;
  animation: drift3 7s ease-in-out infinite;
}

.photo-4 {
  width: 42%;
  height: 38%;
  bottom: 2%;
  left: 3%;
  animation: drift4 10s ease-in-out infinite;
}

.photo-5 {
  width: 46%;
  height: 42%;
  bottom: 0;
  right: 0;
  animation: drift5 8.5s ease-in-out infinite;
}

@keyframes drift1 {
  0%, 100% { transform: rotate(-5deg) translate(0, 0); }
  50% { transform: rotate(-4deg) translate(4px, -6px); }
}

@keyframes drift2 {
  0%, 100% { transform: rotate(4deg) translate(0, 0); }
  50% { transform: rotate(5deg) translate(-5px, 5px); }
}

@keyframes drift3 {
  0%, 100% { transform: rotate(-2deg) translate(0, 0); }
  50% { transform: rotate(-1deg) translate(3px, -4px); }
}

@keyframes drift4 {
  0%, 100% { transform: rotate(6deg) translate(0, 0); }
  50% { transform: rotate(5deg) translate(-4px, -5px); }
}

@keyframes drift5 {
  0%, 100% { transform: rotate(-3deg) translate(0, 0); }
  50% { transform: rotate(-2deg) translate(5px, 4px); }
}

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

.photo-1 .tape {
  width: 45px;
  top: -7px;
  left: 50%;
  margin-left: -22px;
  transform: rotate(3deg);
}

.photo-3 .tape {
  width: 40px;
  top: -6px;
  right: 15px;
  transform: rotate(-4deg);
}

.photo-5 .tape {
  width: 50px;
  top: -8px;
  left: 20px;
  transform: rotate(2deg);
}

.scribble {
  position: absolute;
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--cream);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  pointer-events: none;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.photo-2 .scribble {
  bottom: -18px;
  left: 8px;
  transform: rotate(-2deg);
}

.photo-4 .scribble {
  bottom: -17px;
  right: 6px;
  transform: rotate(1deg);
}

/* Tablet adjustments */
@media (max-width: 768px) {
  .photo {
    padding: 4px;
  }

  .tape {
    height: 12px;
  }

  .scribble {
    font-size: 8px;
  }

  .photo-1 { width: 42%; height: 38%; }
  .photo-2 { width: 38%; height: 42%; }
  .photo-3 { width: 30%; height: 30%; }
  .photo-4 { width: 40%; height: 36%; }
  .photo-5 { width: 44%; height: 40%; }
}

/* Mobile: simplified view with only 2 photos, no animation */
@media (max-width: 900px) {
  .photo-collage {
    display: flex;
    gap: 12px;
    padding: 16px;
    justify-content: center;
    align-items: center;
  }

  /* Only show photos 1 and 2 on mobile */
  .photo-3,
  .photo-4,
  .photo-5 {
    display: none !important;
  }

  .photo {
    position: relative;
    padding: 4px;
    animation: none !important;
    cursor: pointer;
    /* Subtle hint that photos are tappable */
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .photo:active {
    transform: scale(0.97) !important;
  }

  /* Reset positioning for mobile - side by side */
  .photo-1,
  .photo-2 {
    position: relative;
    top: auto;
    left: auto;
    right: auto;
    bottom: auto;
    width: 45%;
    height: 140px;
    max-width: 200px;
  }

  .photo-1 {
    transform: rotate(-3deg);
  }

  .photo-1:active {
    transform: rotate(-3deg) scale(0.97) !important;
  }

  .photo-2 {
    transform: rotate(2deg);
  }

  .photo-2:active {
    transform: rotate(2deg) scale(0.97) !important;
  }

  .tape {
    height: 10px;
  }

  .scribble {
    display: none;
  }
}

@media (max-width: 480px) {
  .photo {
    padding: 3px;
  }

  .photo-1,
  .photo-2 {
    height: 120px;
    max-width: 160px;
  }

  .tape {
    height: 8px;
  }

  .photo-1 .tape { width: 30px; }
}
</style>
