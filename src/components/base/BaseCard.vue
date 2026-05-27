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
  background: var(--slab);
  position: relative;
  border: var(--bd-2);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

/* Variants */
.card--default { /* default block shadow */ }
.card--elevated { box-shadow: var(--shadow); }
.card--bordered { box-shadow: none; }

/* Padding variants */
.card--padding-none .card__content { padding: 0; }
.card--padding-sm   .card__content { padding: var(--space-4); }
.card--padding-md   .card__content { padding: var(--space-6); }
.card--padding-lg   .card__content { padding: var(--space-8); }

.card--padding-sm .card__header,
.card--padding-sm .card__footer { padding: var(--space-4) var(--space-4) 0; }

.card--padding-md .card__header,
.card--padding-md .card__footer { padding: var(--space-6) var(--space-6) 0; }

.card--padding-lg .card__header,
.card--padding-lg .card__footer { padding: var(--space-8) var(--space-8) 0; }

.card__footer {
  padding-top: 0 !important;
  padding-bottom: var(--space-4) !important;
}

.card--hoverable {
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}
.card--hoverable:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow);
}

.card__header {
  border-bottom: var(--bd);
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-3);
}

.card__footer {
  border-top: var(--bd);
  margin-top: var(--space-3);
  padding-top: var(--space-3);
}
</style>
