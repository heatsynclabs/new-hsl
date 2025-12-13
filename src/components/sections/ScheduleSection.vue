<template>
  <section class="schedule-section">
    <BaseContainer>
      <OpenHours />
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import BaseContainer from '../base/BaseContainer.vue'
import OpenHours from '../schedule/OpenHours.vue'
</script>

<style scoped>
.schedule-section {
  padding: var(--space-12) 0;
}

/* Responsive */
@media (max-width: 768px) {
  .schedule-section {
    padding: var(--space-16) 0;
  }
}
</style>