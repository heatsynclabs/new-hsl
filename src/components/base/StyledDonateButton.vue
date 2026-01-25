<template>
  <div class="styled-donate">
    <h3 class="styled-donate__title">Support Our Mission</h3>
    <p class="styled-donate__text">
      Help keep HeatSync Labs running and accessible to everyone.
    </p>
    <a
      href="https://www.zeffy.com/en-US/donation-form/donate-to-heatsync"
      target="_blank"
      rel="noopener"
      class="styled-donate__link"
    >
      <button type="button" class="styled-donate__button">
        <span class="styled-donate__button-text">Donate Now</span>
        <div class="hearts-container">
          <svg class="heart-icon heart-1" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>
          </svg>
          <svg class="heart-icon heart-2" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>
          </svg>
          <svg class="heart-icon heart-3" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>
          </svg>
        </div>
      </button>
    </a>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.styled-donate {
  text-align: center;
  padding: var(--space-8);
  background: linear-gradient(135deg, var(--accent-rust) 0%, var(--accent-sage) 100%);
  border-radius: var(--radius-lg);
  color: var(--paper-white);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.styled-donate__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-3);
  font-family: var(--font-mono);
}

.styled-donate__text {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-6);
  font-family: var(--font-sans);
  opacity: 0.9;
}

.styled-donate__link {
  display: inline-block;
  text-decoration: none;
}

.styled-donate__button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--paper-white);
  color: var(--accent-rust);
  border: none;
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-full);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.styled-donate__button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  background: var(--cream);
}

.styled-donate__button:active {
  transform: translateY(0);
}

.styled-donate__button-text {
  letter-spacing: var(--tracking-wide);
}

.hearts-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.heart-icon {
  position: absolute;
  opacity: 0;
  color: var(--accent-sage);
  transition: all 0.6s ease-out;
}

.heart-1 {
  top: 20%;
  left: 15%;
}

.heart-2 {
  top: 60%;
  right: 20%;
}

.heart-3 {
  top: 40%;
  left: 70%;
}

.styled-donate__button:hover .heart-icon {
  opacity: 1;
  animation: floatHeart 1.5s ease-out;
}

.styled-donate__button:hover .heart-1 {
  animation-delay: 0s;
}

.styled-donate__button:hover .heart-2 {
  animation-delay: 0.3s;
}

.styled-donate__button:hover .heart-3 {
  animation-delay: 0.6s;
}

@keyframes floatHeart {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translateY(-30px) scale(1.2);
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .styled-donate {
    padding: var(--space-6);
  }

  .styled-donate__title {
    font-size: var(--text-xl);
  }

  .styled-donate__button {
    font-size: var(--text-base);
    padding: var(--space-3) var(--space-6);
  }
}
</style>