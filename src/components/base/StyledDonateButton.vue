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
  gap: 8px;
  background: var(--hazard);
  color: var(--tape-dark);
  border: 2px solid var(--tape-dark);
  padding: 18px 30px;
  font-family: var(--font-ui);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.donate-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow);
}

.donate-btn:active {
  transform: translate(0, 0);
  box-shadow: var(--shadow-sm);
}

.donate-btn__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: var(--rust);
}

@media (max-width: 768px) {
  .donate-btn {
    font-size: 13px;
    padding: 14px 22px;
  }
}
</style>
