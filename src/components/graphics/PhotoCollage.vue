<template>
  <div class="photo-collage">
    <!-- Featured single image view -->
    <div v-if="showFeaturedImage && featuredPhoto" class="featured-container">
      <img
        :src="featuredPhoto.url"
        :alt="featuredPhoto.title"
        :title="featuredPhoto.title"
        class="featured-image"
        @load="onImageLoad(featuredPhoto.id)"
        @error="onImageError(featuredPhoto.id)"
      />
      <div class="featured-overlay">
        <span class="featured-title">{{ featuredPhoto.title }}</span>
      </div>
    </div>

    <!-- Collage view -->
    <div v-else class="collage-container">
      <div
        v-for="(photo, index) in visiblePhotos"
        :key="photo.id"
        :class="[
          'photo-item',
          `photo-item--${index % 6}`,
          { 'photo-item--loading': loadingImages.has(photo.id) }
        ]"
        :style="{
          '--delay': `${index * 0.3}s`,
          animationDelay: `${index * 0.3}s`
        }"
      >
        <img
          :src="photo.thumbnail"
          :alt="photo.title"
          :title="photo.title"
          class="photo-image"
          @load="onImageLoad(photo.id)"
          @error="onImageError(photo.id)"
          loading="lazy"
        />
        <div class="photo-overlay">
          <span class="photo-title">{{ truncateTitle(photo.title) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { FlickrService, type FlickrPhoto } from '../../services/flickrService'

const flickrService = new FlickrService()
const photos = ref<FlickrPhoto[]>([])
const visiblePhotos = ref<FlickrPhoto[]>([])
const loadingImages = ref(new Set<string>())
const currentIndex = ref(0)
const showFeaturedImage = ref(false)
const featuredPhoto = ref<FlickrPhoto | null>(null)

let rotationInterval: number | null = null

const PHOTOS_TO_SHOW = 6
const COLLAGE_DURATION = 6000 // 6 seconds
const FEATURED_DURATION = 3000 // 3 seconds

const loadPhotos = async () => {
  try {
    const fetchedPhotos = await flickrService.getPhotos(30)
    photos.value = fetchedPhotos

    if (fetchedPhotos.length > 0) {
      updateVisiblePhotos()
      startRotation()
    }
  } catch (error) {
    console.error('Failed to load photos:', error)
  }
}

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
  }
  return shuffled
}

const updateVisiblePhotos = () => {
  if (photos.value.length === 0) return

  // Get a random selection of photos
  const shuffledPhotos = shuffleArray(photos.value)
  visiblePhotos.value = shuffledPhotos.slice(0, PHOTOS_TO_SHOW)
}

const startRotation = () => {
  if (photos.value.length <= PHOTOS_TO_SHOW) return

  const cycle = () => {
    if (showFeaturedImage.value) {
      // Pre-load next collage photos before switching
      updateVisiblePhotos()

      // Add fade out effect
      const container = document.querySelector('.featured-container') as HTMLElement
      if (container) {
        container.style.opacity = '0'
      }

      setTimeout(() => {
        showFeaturedImage.value = false
        setTimeout(cycle, COLLAGE_DURATION)
      }, 300) // Small delay for fade out
    } else {
      // Pre-select next featured photo
      const availablePhotos = photos.value.filter(p => !visiblePhotos.value.includes(p))
      const randomPhoto = availablePhotos.length > 0
        ? availablePhotos[Math.floor(Math.random() * availablePhotos.length)]!
        : photos.value[Math.floor(Math.random() * photos.value.length)]!

      featuredPhoto.value = randomPhoto

      // Add fade out effect
      const container = document.querySelector('.collage-container') as HTMLElement
      if (container) {
        container.style.opacity = '0'
      }

      setTimeout(() => {
        showFeaturedImage.value = true
        setTimeout(cycle, FEATURED_DURATION)
      }, 300) // Small delay for fade out
    }
  }

  // Start with collage view
  setTimeout(cycle, COLLAGE_DURATION)
}

const stopRotation = () => {
  if (rotationInterval) {
    clearInterval(rotationInterval)
    rotationInterval = null
  }
}

const onImageLoad = (photoId: string) => {
  loadingImages.value.delete(photoId)
}

const onImageError = (photoId: string) => {
  loadingImages.value.delete(photoId)
  console.warn(`Failed to load image: ${photoId}`)
}

const truncateTitle = (title: string) => {
  if (title.length <= 25) return title
  return title.substring(0, 25) + '...'
}

onMounted(() => {
  loadPhotos()
})

onUnmounted(() => {
  stopRotation()
})
</script>

<style scoped>
.photo-collage {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0.8;
}

.featured-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  animation: fadeIn 0.5s ease-out;
  transition: opacity 0.3s ease-out;
}

.featured-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 24px var(--shadow-medium);
  transition: transform var(--transition-base);
}

.featured-image:hover {
  transform: scale(1.02);
}

.featured-overlay {
  position: absolute;
  bottom: var(--space-6);
  left: var(--space-6);
  right: var(--space-6);
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: var(--paper-white);
  padding: var(--space-4);
  border-radius: var(--radius-base);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.featured-container:hover .featured-overlay {
  opacity: 1;
}

.featured-title {
  font-size: var(--text-lg);
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
  line-height: 1.3;
}

.collage-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: var(--space-3);
  padding: var(--space-4);
  animation: fadeIn 0.5s ease-out;
  transition: opacity 0.3s ease-out;
}

.photo-item {
  position: relative;
  border-radius: var(--radius-base);
  overflow: hidden;
  background: var(--cream);
  box-shadow: 2px 2px 8px var(--shadow-light);
  transition: all var(--transition-base);
  animation: fadeInSlide 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.photo-item--0 {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

.photo-item--1 {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
}

.photo-item--2 {
  grid-column: 3 / 4;
  grid-row: 1 / 2;
}

.photo-item--3 {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}

.photo-item--4 {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}

.photo-item--5 {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
}

.photo-item:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 4px 4px 12px var(--shadow-medium);
  z-index: 2;
}

.photo-item:hover .photo-overlay {
  opacity: 1;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  transition: transform var(--transition-base);
}

.photo-item:hover .photo-image {
  transform: scale(1.05);
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: var(--paper-white);
  padding: var(--space-3);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.photo-title {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
  line-height: 1.2;
}

.photo-item--loading {
  background: var(--warm-gray);
}

.photo-item--loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid var(--accent-rust);
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes fadeInSlide {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .collage-container {
    gap: var(--space-2);
    padding: var(--space-3);
  }

  .featured-container {
    padding: var(--space-3);
  }

  .featured-overlay {
    bottom: var(--space-4);
    left: var(--space-4);
    right: var(--space-4);
    padding: var(--space-3);
  }

  .featured-title {
    font-size: var(--text-base);
  }
}

@media (max-width: 768px) {
  .collage-container {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: var(--space-1);
    padding: var(--space-2);
  }

  .photo-item--0 {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .photo-item--1 {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }

  .photo-item--2 {
    grid-column: 1 / 3;
    grid-row: 2 / 3;
  }

  .photo-item--3 {
    grid-column: 1 / 2;
    grid-row: 3 / 4;
  }

  .photo-item--4 {
    grid-column: 2 / 3;
    grid-row: 3 / 4;
  }

  .photo-item--5 {
    display: none;
  }

  .featured-container {
    padding: var(--space-2);
  }

  .featured-overlay {
    bottom: var(--space-2);
    left: var(--space-2);
    right: var(--space-2);
    padding: var(--space-2);
  }

  .featured-title {
    font-size: var(--text-sm);
  }

  .photo-title {
    font-size: 10px;
  }

  .photo-overlay {
    padding: var(--space-2);
  }
}

@media (max-width: 480px) {
  .collage-container {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 4px;
    padding: var(--space-1);
  }

  .photo-item--0 {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .photo-item--1 {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }

  .photo-item--2 {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
  }

  .photo-item--3 {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
  }

  .photo-item--4,
  .photo-item--5 {
    display: none;
  }

  .featured-container {
    padding: var(--space-1);
  }

  .featured-overlay {
    bottom: var(--space-1);
    left: var(--space-1);
    right: var(--space-1);
    padding: var(--space-1);
  }

  .featured-title {
    font-size: var(--text-xs);
  }

  .photo-title {
    font-size: 8px;
    line-height: 1.1;
  }

  .photo-overlay {
    padding: var(--space-1);
  }
}
</style>