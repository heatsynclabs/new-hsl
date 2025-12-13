<template>
  <div class="calendar-page">
    <BaseContainer>
      <FullCalendar />
    </BaseContainer>
  </div>
</template>

<script setup lang="ts">
import BaseContainer from '../components/base/BaseContainer.vue'
import FullCalendar from '../components/calendar/FullCalendar.vue'
</script>

<style scoped>
.calendar-page {
  flex: 1;
  padding: var(--space-8) 0;
}

@media (max-width: 768px) {
  .calendar-page {
    padding: var(--space-4) 0;
  }
}
</style>