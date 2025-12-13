<template>
  <section class="support-section">
    <BaseContainer>
      <div class="support-content">
        <div class="support-text">
          <h2 class="support-title">Support HeatSync Labs</h2>
          <p class="support-description">
            Help us keep the lights on, the tools running, and the doors open for everyone. Your donation directly supports our community workshop and makes it possible for people to learn, build, and share together.
          </p>
        </div>
        <div class="support-action">
          <StyledDonateButton />
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import BaseContainer from '../base/BaseContainer.vue'
import StyledDonateButton from '../base/StyledDonateButton.vue'
</script>

<style scoped>
.support-section {
  background: var(--cream);
  padding: var(--space-16) 0;
  border-top: 1px solid var(--warm-gray);
  border-bottom: 1px solid var(--warm-gray);
}

.support-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-12);
  align-items: center;
}

.support-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-light);
  margin-bottom: var(--space-4);
  color: var(--ink-black);
  font-family: var(--font-sans);
}

.support-description {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--graphite);
  font-family: var(--font-sans);
}

.support-action {
  text-align: center;
}

@media (max-width: 768px) {
  .support-section {
    padding: var(--space-12) 0;
  }

  .support-content {
    grid-template-columns: 1fr;
    gap: var(--space-8);
    text-align: center;
  }

  .support-title {
    font-size: var(--text-2xl);
  }

  .support-description {
    font-size: var(--text-base);
  }
}
</style>