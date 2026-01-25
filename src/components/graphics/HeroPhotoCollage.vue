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
      :data-images="JSON.stringify(photo.images)"
    >
      <div v-if="tapes.includes(index + 1)" class="tape"></div>
      <div class="photo-stack">
        <img
          class="photo-current"
          :src="photo.currentImage"
          :alt="`Workshop activity ${index + 1}`"
        />
        <img
          class="photo-next"
          alt=""
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
  currentImage: string
  currentIndex: number
}

const flickrService = new FlickrService()
const photos = ref<PhotoItem[]>([])
const tornTops = [2, 5]
const tornBottoms = [1, 4]
const tapes = [1, 3, 5]
const scribbles: Record<number, string> = {}

let rotationIntervals: number[] = []

const initPhotos = async () => {
  try {
    // Flickr RSS feed returns max 20 photos
    const fetchedPhotos = await flickrService.getPhotos(20)

    // Group photos into 5 sets, distributing evenly
    const photoGroups: PhotoItem[] = []
    const numGroups = 5
    const photosPerGroup = Math.ceil(fetchedPhotos.length / numGroups)

    for (let i = 0; i < numGroups; i++) {
      const startIdx = i * photosPerGroup
      const groupImages = fetchedPhotos.slice(startIdx, startIdx + photosPerGroup).map(p => p.url)

      if (groupImages.length > 0) {
        photoGroups.push({
          images: groupImages,
          currentImage: groupImages[0],
          currentIndex: 0
        })
      }
    }

    // Fill in with placeholder images if not enough photos
    while (photoGroups.length < 5) {
      photoGroups.push({
        images: ['/hsl-logo.png'],
        currentImage: '/hsl-logo.png',
        currentIndex: 0
      })
    }

    photos.value = photoGroups
    startRotations()
  } catch (error) {
    console.error('Failed to load photos:', error)
    // Use placeholder images
    photos.value = Array(5).fill(null).map(() => ({
      images: ['/hsl-logo.png'],
      currentImage: '/hsl-logo.png',
      currentIndex: 0
    }))
  }
}

const startRotations = () => {
  photos.value.forEach((photo, index) => {
    if (photo.images.length <= 1) return

    const delay = index * 1800

    setTimeout(() => {
      const intervalId = window.setInterval(() => {
        const container = document.querySelector(`.photo-${index + 1}`)
        const currentImg = container?.querySelector('.photo-current') as HTMLImageElement
        const nextImg = container?.querySelector('.photo-next') as HTMLImageElement

        if (currentImg && nextImg) {
          const nextIndex = (photo.currentIndex + 1) % photo.images.length
          const nextSrc = photo.images[nextIndex]

          // Set next image src and wait for load
          nextImg.onload = () => {
            // Fade in the next image on top
            nextImg.style.visibility = 'visible'
            nextImg.style.opacity = '1'

            // After transition, update current and reset next
            setTimeout(() => {
              photo.currentIndex = nextIndex
              photo.currentImage = nextSrc
              currentImg.src = nextSrc
              nextImg.style.opacity = '0'
              nextImg.style.visibility = 'hidden'
            }, 500)
          }

          nextImg.src = nextSrc
        }
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

.photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.9) contrast(1.02);
}

.photo-current {
  position: relative;
  z-index: 1;
}

.photo-next {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease, visibility 0.5s ease;
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

/* Mobile adjustments */
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

@media (max-width: 480px) {
  .photo {
    padding: 3px;
  }

  .tape {
    height: 10px;
  }

  .scribble {
    font-size: 7px;
  }

  .photo-1 .tape { width: 35px; }
  .photo-3 .tape { width: 30px; }
  .photo-5 .tape { width: 40px; }

  @keyframes drift1 {
    0%, 100% { transform: rotate(-3deg) translate(0, 0); }
    50% { transform: rotate(-2deg) translate(2px, -3px); }
  }

  @keyframes drift2 {
    0%, 100% { transform: rotate(2deg) translate(0, 0); }
    50% { transform: rotate(3deg) translate(-2px, 2px); }
  }

  @keyframes drift3 {
    0%, 100% { transform: rotate(-1deg) translate(0, 0); }
    50% { transform: rotate(0deg) translate(1px, -2px); }
  }

  @keyframes drift4 {
    0%, 100% { transform: rotate(3deg) translate(0, 0); }
    50% { transform: rotate(2deg) translate(-2px, -2px); }
  }

  @keyframes drift5 {
    0%, 100% { transform: rotate(-2deg) translate(0, 0); }
    50% { transform: rotate(-1deg) translate(2px, 2px); }
  }
}
</style>