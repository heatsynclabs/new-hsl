<template>
  <section class="info-section">
    <BaseContainer>
      <InfoGrid :items="infoItems" />
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import BaseContainer from '../base/BaseContainer.vue'
import InfoGrid, { type InfoItem } from '../info/InfoGrid.vue'

const infoItems: InfoItem[] = [
  {
    title: 'Open Workshop',
    description: '3,200 square feet of workspace equipped with 3D printers, laser cutters, electronics workbenches, and traditional tools for woodworking and metalworking.',
  },
  {
    title: 'Community Driven',
    description: 'Member-owned and operated since 2009. We\'re a 501(c)3 non-profit dedicated to fostering creativity and technical education in Mesa.',
  },
  {
    title: 'Learn & Share',
    description: 'Regular workshops, hackathons, and skill-sharing sessions. From Arduino basics to advanced fabrication techniques, there\'s always something new.',
  },
]
</script>

<style scoped>
.info-section {
  padding: var(--space-20) 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .info-section {
    padding: var(--space-16) 0;
  }
}
</style>