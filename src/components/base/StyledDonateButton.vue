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
  background: var(--orange);
  color: var(--ink);
  border: 3px solid var(--ink);
  padding: var(--space-4) var(--space-10);
  font-size: var(--text-2xl);
  font-weight: 400;
  font-family: var(--font-ui);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.donate-btn:hover {
  transform: translate(-3px, -3px);
  box-shadow: 8px 8px 0 var(--paper);
}

.donate-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--paper);
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
