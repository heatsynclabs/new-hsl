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
  background: var(--cream);
  position: relative;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  border-radius: var(--radius-base);
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-rust), var(--accent-sage));
  border-radius: var(--radius-base) var(--radius-base) 0 0;
}

/* Variants */
.card--default {
  box-shadow: 4px 4px 16px var(--shadow-light);
}

.card--elevated {
  box-shadow: 6px 6px 20px var(--shadow-medium);
}

.card--bordered {
  border: 1px solid var(--warm-gray);
  box-shadow: 2px 2px 8px var(--shadow-light);
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

/* Hoverable effect */
.card--hoverable:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 20px var(--shadow-heavy);
}

/* Header and footer styling */
.card__header {
  border-bottom: 1px solid rgba(107, 104, 102, 0.2);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
}

.card__footer {
  border-top: 1px solid rgba(107, 104, 102, 0.2);
  margin-top: var(--space-4);
  padding-top: var(--space-4);
}
</style>
