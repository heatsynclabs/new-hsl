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
  font-family: var(--font-ui);
  font-weight: var(--font-normal);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  text-decoration: none;
  border: var(--border-thick);
  cursor: pointer;
  transition: transform var(--transition-base), box-shadow var(--transition-base), background-color var(--transition-base), color var(--transition-base);
  position: relative;
  white-space: nowrap;
  line-height: 1;
}

.btn:focus-visible {
  outline: 3px solid var(--color-accent-primary);
  outline-offset: 2px;
}

/* Sizes */
.btn--sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-base);
  min-height: 34px;
}

.btn--md {
  padding: var(--space-2) var(--space-6);
  font-size: var(--text-lg);
  min-height: 42px;
}

.btn--lg {
  padding: var(--space-3) var(--space-8);
  font-size: var(--text-xl);
  min-height: var(--button-height);
}

/* PRIMARY - filled & flat at rest; the block shadow is the hover reward */
.btn--primary {
  background: var(--ink);
  color: var(--paper);
  border-color: var(--ink);
}

:global([data-theme="dark"]) .btn--primary {
  background: var(--orange);
  color: var(--ink);
  border-color: var(--orange);
}

.btn--primary:hover:not(.btn--disabled) {
  transform: translate(-2px, -2px);
  box-shadow: 8px 8px 0 var(--orange);
}

:global([data-theme="dark"]) .btn--primary:hover:not(.btn--disabled) {
  box-shadow: 8px 8px 0 var(--paper-d);
}

.btn--primary:active:not(.btn--disabled) {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 var(--orange);
}

/* SECONDARY - flat, bordered. No shadow. */
.btn--secondary {
  background: transparent;
  color: var(--color-text-primary);
  border-color: var(--color-text-primary);
}

.btn--secondary:hover:not(.btn--disabled) {
  background: var(--color-text-primary);
  color: var(--color-bg-primary);
}

/* OUTLINE - flat, orange border. No shadow. */
.btn--outline {
  background: transparent;
  color: var(--color-accent-secondary);
  border-color: var(--color-accent-primary);
}

.btn--outline:hover:not(.btn--disabled) {
  background: var(--color-accent-primary);
  color: var(--ink);
}

/* Disabled state */
.btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn:active:not(.btn--disabled) {
  transform: translate(1px, 1px);
}
</style>
