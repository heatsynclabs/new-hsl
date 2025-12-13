<template>
  <div class="info-grid">
    <BaseCard
      v-for="item in items"
      :key="item.title"
      hoverable
      class="info-card"
    >
      <h3 class="info-card__title">{{ item.title }}</h3>
      <p class="info-card__description">{{ item.description }}</p>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import BaseCard from '../base/BaseCard.vue'

export interface InfoItem {
  title: string
  description: string
}

interface Props {
  items: InfoItem[]
}

defineProps<Props>()
</script>

<style scoped>
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-8);
}

.info-card__title {
  font-size: var(--text-xl);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-3);
  font-family: var(--font-mono);
  color: var(--ink-black);
}

.info-card__description {
  color: var(--warm-gray);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  line-height: var(--leading-loose);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .info-grid {
    gap: var(--space-6);
  }
}
</style>