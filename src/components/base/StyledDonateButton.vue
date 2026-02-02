<template>
  <a
    href="https://www.zeffy.com/en-US/donation-form/donate-to-heatsync"
    target="_blank"
    rel="noopener"
    class="donate-btn"
  >
    <svg class="donate-btn__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>
    </svg>
    Donate Now
  </a>
</template>

<script setup lang="ts">
</script>

<style scoped>
.donate-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--color-bg-primary);
  color: var(--color-accent-primary);
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: var(--space-3) var(--space-8);
  border-radius: var(--radius-full);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  font-family: var(--font-mono);
  letter-spacing: var(--tracking-wide);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.donate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  background: var(--color-bg-secondary);
}

.donate-btn:active {
  transform: translateY(0);
}

.donate-btn__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .donate-btn {
    font-size: var(--text-base);
    padding: var(--space-3) var(--space-6);
  }
}
</style>
