<template>
  <div :class="logoClasses">
    <img src="/hsl-logo.png" alt="HeatSync Labs" class="logo__mark" />
    <span v-if="showText" class="logo__text">HeatSync Labs</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  interactive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showText: true,
  interactive: true,
})

const logoClasses = computed(() => [
  'logo',
  `logo--${props.size}`,
  {
    'logo--interactive': props.interactive,
    'logo--text-only': !props.showText,
  },
])
</script>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-tight);
  color: var(--ink-black);
  text-decoration: none;
  transition: all var(--transition-base);
}

.logo__mark {
  transition: transform var(--transition-base);
  flex-shrink: 0;
  object-fit: contain;
}

.logo__text {
  white-space: nowrap;
}

/* Sizes */
.logo--sm .logo__mark {
  width: 24px;
  height: 24px;
}

.logo--sm .logo__text {
  font-size: var(--text-base);
}

.logo--md .logo__mark {
  width: 32px;
  height: 32px;
}

.logo--md .logo__text {
  font-size: var(--text-xl);
}

.logo--lg .logo__mark {
  width: 48px;
  height: 48px;
}

.logo--lg .logo__text {
  font-size: var(--text-2xl);
}

/* Interactive state */
.logo--interactive:hover .logo__mark {
  transform: rotate(72deg);
}

.logo--interactive:hover {
  color: var(--accent-rust);
}

/* Text-only variant */
.logo--text-only {
  gap: 0;
}

.logo--text-only .logo__mark {
  display: none;
}
</style>