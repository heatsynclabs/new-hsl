<template>
  <section class="hero">
    <BaseContainer>
      <div class="hero__content">
        <h1 class="hero__title">
          Mesa's Community <strong>Hackerspace</strong>
        </h1>
        <p class="hero__description">
          A collaborative workshop where makers, artists, and technologists
          gather to create, learn, and share knowledge in the heart of Mesa.
        </p>
        <div class="hero__actions">
          <BaseButton variant="primary" size="lg" href="http://bit.ly/hslslack" target="_blank" rel="noopener">
            Join the Community
          </BaseButton>
          <BaseButton variant="secondary" size="lg" to="/about#visit-us">
            Visit Us
          </BaseButton>
        </div>
      </div>

      <div class="hero__pattern">
        <PhotoCollage />
      </div>
    </BaseContainer>

    <!-- Mobile photo carousel - only visible on small screens -->
    <div class="hero__mobile-photos">
      <BaseContainer>
        <MobilePhotoCarousel />
      </BaseContainer>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseContainer from '../base/BaseContainer.vue'
import BaseButton from '../base/BaseButton.vue'
import PhotoCollage from '../graphics/PhotoCollage.vue'
import MobilePhotoCarousel from '../graphics/MobilePhotoCarousel.vue'
</script>

<style scoped>
.hero {
  padding: var(--space-32) 0 var(--space-16);
  position: relative;
  overflow: hidden;
}

.hero .container {
  position: relative;
  z-index: var(--z-raised);
}

.hero__content {
  max-width: 600px;
}

.hero__title {
  font-size: clamp(var(--text-4xl), 5vw, var(--text-7xl));
  font-weight: var(--font-light);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-6);
  letter-spacing: var(--tracking-tight);
  font-family: var(--font-mono);
}

.hero__title strong {
  font-weight: var(--font-semibold);
  color: var(--accent-rust);
}

.hero__description {
  font-size: var(--text-lg);
  color: var(--warm-gray);
  margin-bottom: var(--space-10);
  font-family: var(--font-sans);
  line-height: var(--leading-relaxed);
}

.hero__actions {
  display: flex;
  gap: var(--space-5);
  flex-wrap: wrap;
}

.hero__pattern {
  position: absolute;
  top: 0;
  right: -100px;
  width: 600px;
  height: 100%;
  opacity: 0.9;
  pointer-events: none;
  z-index: var(--z-base);
}

.hero__mobile-photos {
  display: none;
  padding: var(--space-8) 0 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero__pattern {
    right: -200px;
    width: 500px;
    opacity: 0.8;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: var(--space-20) 0 var(--space-8);
  }

  .hero__pattern {
    display: none;
  }

  .hero__mobile-photos {
    display: block;
  }

  .hero__actions {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .hero__actions {
    width: 100%;
  }

  .hero__actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>