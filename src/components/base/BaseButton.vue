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
  gap: 8px;
  font-family: var(--font-ui);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  border: 2px solid var(--tape-dark);
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease, background-color var(--transition-fast), color var(--transition-fast);
  white-space: nowrap;
  line-height: 1;
}

.btn:focus-visible {
  outline: 2px solid var(--hazard);
  outline-offset: 3px;
}

.btn--sm {
  padding: 9px 16px;
  font-size: 11px;
  min-height: 34px;
}

.btn--md {
  padding: 12px 20px;
  font-size: 12px;
  min-height: 42px;
}

.btn--lg {
  padding: 18px 30px;
  font-size: 15px;
  min-height: 56px;
}

.btn--primary {
  background: var(--hazard);
  color: var(--tape-dark);
  border-color: var(--tape-dark);
  box-shadow: var(--shadow-sm);
}

.btn--primary:hover:not(.btn--disabled) {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow);
}

.btn--primary:active:not(.btn--disabled) {
  transform: translate(0, 0);
  box-shadow: var(--shadow-sm);
}

.btn--secondary {
  background: transparent;
  color: var(--color-text-primary);
  border-color: var(--steel-hi);
  box-shadow: none;
}

.btn--secondary:hover:not(.btn--disabled) {
  border-color: var(--hazard);
  color: var(--accent-text);
  transform: translateY(-2px);
}

.btn--outline {
  background: transparent;
  color: var(--accent-text);
  border-color: var(--hazard);
  box-shadow: none;
}

.btn--outline:hover:not(.btn--disabled) {
  background: var(--hazard);
  color: var(--tape-dark);
  transform: translateY(-2px);
}

.btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
