<template>
  <div class="register-page">
    <BaseContainer>
      <div class="register-header">
        <h1 class="register-title">Class Registration</h1>
        <p class="register-subtitle">
          Fill out the form below to register for classes at HeatSync Labs.
        </p>
      </div>

      <div class="airtable-embed">
        <iframe
          class="airtable-embed__iframe"
          src="https://airtable.com/embed/shrTr15stAbuQvnPz?backgroundColor=purple"
          frameborder="0"
          onmousewheel=""
          width="100%"
          height="533"
          style="background: transparent; border: 1px solid #ccc;"
        ></iframe>
      </div>

      <div class="register-footer">
        <BaseButton
          variant="outline"
          to="/classes"
        >
          ← Back to Classes
        </BaseButton>
      </div>
    </BaseContainer>
  </div>
</template>

<script setup lang="ts">
import BaseContainer from '../components/base/BaseContainer.vue'
import BaseButton from '../components/base/BaseButton.vue'
</script>

<style scoped>
.register-page {
  flex: 1;
  padding: var(--space-8) 0;
}

.register-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.register-title {
  font-size: var(--text-4xl);
  font-weight: var(--font-light);
  margin-bottom: var(--space-4);
  color: var(--ink-black);
  font-family: var(--font-sans);
}

.register-subtitle {
  font-size: var(--text-lg);
  color: var(--warm-gray);
  font-family: var(--font-sans);
  max-width: 600px;
  margin: 0 auto;
  line-height: var(--leading-relaxed);
}

.airtable-embed {
  background: var(--paper-white);
  border-radius: var(--radius-base);
  overflow: hidden;
  box-shadow: 0 4px 6px var(--shadow-light);
  margin-bottom: var(--space-8);
}

.airtable-embed__iframe {
  display: block;
  border-radius: var(--radius-base);
  min-height: 700px;
}

.register-footer {
  text-align: center;
}

@media (max-width: 768px) {
  .register-page {
    padding: var(--space-4) 0;
  }

  .register-title {
    font-size: var(--text-3xl);
  }

  .register-subtitle {
    font-size: var(--text-base);
  }

  .airtable-embed__iframe {
    min-height: 600px;
  }
}
</style>