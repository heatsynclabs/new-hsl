<template>
  <div :class="containerClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'xl',
  padding: true,
})

const containerClasses = computed(() => [
  'container',
  {
    'container--sm': props.size === 'sm',
    'container--md': props.size === 'md',
    'container--lg': props.size === 'lg',
    'container--xl': props.size === 'xl',
    'container--full': props.size === 'full',
    'container--no-padding': !props.padding,
  },
])
</script>

<style scoped>
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-6);
  padding-right: var(--space-6);
}

.container--sm {
  max-width: var(--container-sm);
}

.container--md {
  max-width: var(--container-md);
}

.container--lg {
  max-width: var(--container-lg);
}

.container--xl {
  max-width: var(--container-xl);
}

.container--full {
  max-width: none;
}

.container--no-padding {
  padding-left: 0;
  padding-right: 0;
}

@media (max-width: 768px) {
  .container {
    padding-left: var(--space-4);
    padding-right: var(--space-4);
  }
}
</style>
