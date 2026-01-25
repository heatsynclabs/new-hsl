<template>
  <svg class="geometric-pattern" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="0.5"/>
      </pattern>
    </defs>

    <!-- Grid background -->
    <rect width="100%" height="100%" fill="url(#grid)" />

    <!-- Geometric shapes matching mockup -->
    <circle cx="200" cy="150" r="80" fill="none" stroke="currentColor" stroke-width="0.5"/>
    <rect x="350" y="100" width="100" height="100" fill="none" stroke="currentColor" stroke-width="0.5" transform="rotate(45 400 150)"/>
    <polygon points="550,50 650,150 550,250" fill="none" stroke="currentColor" stroke-width="0.5"/>
  </svg>
</template>

<style scoped>
.geometric-pattern {
  width: 100%;
  height: 100%;
  color: var(--ink-black);
}

.shape-group {
  transform-origin: center;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .geometric-pattern * {
    animation: none !important;
  }

  .geometric-pattern animateTransform,
  .geometric-pattern animate {
    display: none;
  }
}
</style>