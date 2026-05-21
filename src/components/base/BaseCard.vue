<template>
  <div :class="cardClasses" v-bind="$attrs">
    <div v-if="$slots.header" class="card__header">
      <slot name="header" />
    </div>

    <div class="card__content">
      <slot />
    </div>

    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'elevated' | 'bordered'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  hoverable: false,
})

const cardClasses = computed(() => [
  'card',
  `card--${props.variant}`,
  `card--padding-${props.padding}`,
  {
    'card--hoverable': props.hoverable,
  },
])
</script>

<style scoped>
.card {
  background: var(--color-bg-secondary);
  position: relative;
  border: var(--color-border-thick);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  border-radius: 0;
}

/* Variants - flat & bordered by default; block shadow only when elevated */
.card--default {
  box-shadow: none;
}

.card--elevated {
  box-shadow: var(--color-shadow-block-orange);
}

.card--bordered {
  border: var(--color-border-thick);
}

/* Padding variants */
.card--padding-none .card__content {
  padding: 0;
}

.card--padding-sm .card__content {
  padding: var(--space-4);
}

.card--padding-md .card__content {
  padding: var(--space-8);
}

.card--padding-lg .card__content {
  padding: var(--space-12);
}

.card--padding-sm .card__header,
.card--padding-sm .card__footer {
  padding: var(--space-4) var(--space-4) 0;
}

.card--padding-md .card__header,
.card--padding-md .card__footer {
  padding: var(--space-8) var(--space-8) 0;
}

.card--padding-lg .card__header,
.card--padding-lg .card__footer {
  padding: var(--space-12) var(--space-12) 0;
}

.card__footer {
  padding-top: 0 !important;
  padding-bottom: var(--space-4) !important;
}

/* Hoverable effect - quiet: orange edge, slight lift. No shadow bloom. */
.card--hoverable {
  transition: transform var(--transition-base), border-color var(--transition-base);
}
.card--hoverable:hover {
  transform: translateY(-2px);
  border-color: var(--color-accent-primary);
}

/* Header and footer styling */
.card__header {
  border-bottom: 2px solid var(--color-border-light);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
}

.card__footer {
  border-top: 2px solid var(--color-border-light);
  margin-top: var(--space-4);
  padding-top: var(--space-4);
}
</style>
