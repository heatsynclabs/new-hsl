<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :to="to"
    :href="href"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  href?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
})

const tag = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return 'button'
})

const buttonClasses = computed(() => [
  'btn',
  `btn--${props.variant}`,
  `btn--${props.size}`,
  {
    'btn--disabled': props.disabled,
  },
])
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
  letter-spacing: var(--tracking-wide);
  text-decoration: none;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.btn:focus-visible {
  outline: 2px solid var(--accent-rust);
  outline-offset: 2px;
}

/* Sizes */
.btn--sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-xs);
  min-height: 32px;
}

.btn--md {
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-sm);
  min-height: 40px;
}

.btn--lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-base);
  min-height: var(--button-height);
}

/* Variants */
.btn--primary {
  background: var(--ink-black);
  color: var(--cream);
  box-shadow: 2px 2px 8px var(--shadow-light);
}

.btn--primary:hover:not(.btn--disabled) {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 12px var(--shadow-medium);
}

.btn--secondary {
  background: transparent;
  color: var(--graphite);
  border-color: var(--graphite);
}

.btn--secondary:hover:not(.btn--disabled) {
  background: var(--graphite);
  color: var(--cream);
}

.btn--outline {
  background: var(--cream);
  color: var(--ink-black);
  border-color: var(--warm-gray);
  box-shadow: 2px 2px 8px var(--shadow-light);
}

.btn--outline:hover:not(.btn--disabled) {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 10px var(--shadow-medium);
  border-color: var(--accent-rust);
}

/* Disabled state */
.btn--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

/* Active/pressed state */
.btn:active:not(.btn--disabled) {
  transform: translate(0, 0);
  box-shadow: 1px 1px 4px var(--shadow-light);
}
</style>