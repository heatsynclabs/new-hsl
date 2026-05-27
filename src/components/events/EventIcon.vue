<template>
  <svg
    class="event-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="content"
  ></svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EVENT_ICONS } from '../../utils/eventIcons'

const props = defineProps<{ name: string }>()

// Falls back to the generic calendar glyph if the name isn't registered.
const content = computed(() => EVENT_ICONS[props.name] ?? EVENT_ICONS.calendar)
</script>

<style scoped>
.event-icon {
  display: inline-block;
  flex-shrink: 0;
  width: 1em;
  height: 1em;
}
</style>
