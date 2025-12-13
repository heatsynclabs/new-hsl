<template>
  <div class="mobile-photo-carousel">
    <div v-if="currentPhoto" class="photo-container">
      <img
        :src="currentPhoto.url"
        :alt="currentPhoto.title"
        :title="currentPhoto.title"
        class="photo-image"
        @load="onImageLoad"
        @error="onImageError"
      />
      <div class="photo-overlay">
        <span class="photo-title">{{ truncateTitle(currentPhoto.title) }}</span>
      </div>
    </div>
    <div v-else class="loading-container">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { FlickrService, type FlickrPhoto } from '../../services/flickrService'

const flickrService = new FlickrService()
const photos = ref<FlickrPhoto[]>([])
const currentPhoto = ref<FlickrPhoto | null>(null)
const currentIndex = ref(0)

let rotationInterval: number | null = null

const ROTATION_DURATION = 4000 // 4 seconds per photo

const loadPhotos = async () => {
  try {
    const fetchedPhotos = await flickrService.getPhotos(20)
    photos.value = fetchedPhotos

    if (fetchedPhotos.length > 0) {
      currentPhoto.value = fetchedPhotos[0]!
      startRotation()
    }
  } catch (error) {
    console.error('Failed to load photos:', error)
  }
}

const startRotation = () => {
  if (photos.value.length <= 1) return

  rotationInterval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % photos.value.length
    currentPhoto.value = photos.value[currentIndex.value]!
  }, ROTATION_DURATION)
}

const stopRotation = () => {
  if (rotationInterval) {
    clearInterval(rotationInterval)
    rotationInterval = null
  }
}

const onImageLoad = () => {
  // Image loaded successfully
}

const onImageError = () => {
  console.warn(`Failed to load image: ${currentPhoto.value?.id}`)
  // Move to next photo if current one fails
  if (photos.value.length > 1) {
    currentIndex.value = (currentIndex.value + 1) % photos.value.length
    currentPhoto.value = photos.value[currentIndex.value]!
  }
}

const truncateTitle = (title: string) => {
  if (title.length <= 40) return title
  return title.substring(0, 40) + '...'
}

onMounted(() => {
  loadPhotos()
})

onUnmounted(() => {
  stopRotation()
})
</script>

<style scoped>
.mobile-photo-carousel {
  width: 100%;
  height: 300px;
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--cream);
  box-shadow: 0 4px 16px var(--shadow-medium);
}

.photo-container {
  position: relative;
  width: 100%;
  height: 100%;
  animation: fadeIn 0.6s ease-out;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: var(--paper-white);
  padding: var(--space-4);
  transform: translateY(100%);
  transition: transform var(--transition-base);
}

.mobile-photo-carousel:hover .photo-overlay {
  transform: translateY(0);
}

.photo-title {
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
  line-height: 1.3;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--warm-gray);
  border-top: 3px solid var(--accent-rust);
  border-radius: 50%;
  animation: spin 1s linear infinite;
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
@media (max-width: 480px) {
  .mobile-photo-carousel {
    height: 250px;
  }

  .photo-title {
    font-size: var(--text-xs);
  }

  .photo-overlay {
    padding: var(--space-3);
  }
}
</style>