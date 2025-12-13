<template>
  <section class="welcome-section">
    <BaseContainer>
      <div class="welcome-content">
        <div class="welcome-grid">
          <div class="welcome-main">
            <h2 class="welcome-title">Open Source. Open Doors.</h2>

            <p class="welcome-intro">
              HeatSync Labs is Arizona's first hackerspace, built on open source principles:
              access for everyone, knowledge shared freely, and the belief that making things
              shouldn't require permission or pedigree. We've been volunteer-run since 2009.
            </p>

            <p class="welcome-philosophy">
              We're a do-ocracy. Show up, make things, contribute back. The same ethos that
              makes open source work makes this space work: collaboration over gatekeeping,
              and no tolerance for people who break the build for everyone else.
            </p>

            <a
              href="https://wiki.heatsynclabs.org/wiki/Bylaws#Unacceptable_Behavior"
              class="welcome-link"
              target="_blank"
              rel="noopener"
            >
              Community Standards
            </a>
          </div>

          <div class="welcome-aside">
            <h3 class="welcome-subtitle">We explicitly welcome:</h3>

            <ul class="welcome-list">
              <li>LGBTQ+ makers</li>
              <li>People of color</li>
              <li>Women and nonbinary folks</li>
              <li>Neurodivergent people</li>
              <li>Beginners who've never touched a tool</li>
              <li>Anyone ready to learn and build</li>
            </ul>
          </div>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import BaseContainer from '../base/BaseContainer.vue'
</script>

<style scoped>
.welcome-section {
  padding: var(--space-12) 0;
  background: var(--paper-white);
  border-bottom: 1px solid var(--warm-gray);
}

.welcome-content {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: var(--space-12);
  align-items: start;
}

.welcome-main {
  max-width: 650px;
}

.welcome-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-light);
  color: var(--ink-black);
  margin-bottom: var(--space-4);
  font-family: var(--font-sans);
}

.welcome-intro {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--graphite);
  margin-bottom: var(--space-6);
  font-family: var(--font-sans);
}

.welcome-philosophy {
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--graphite);
  margin-bottom: var(--space-6);
  font-family: var(--font-sans);
}

.welcome-aside {
  padding-left: var(--space-8);
  border-left: 1px solid var(--warm-gray);
}

.welcome-subtitle {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--graphite);
  margin-bottom: var(--space-4);
  font-family: var(--font-mono);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
}

.welcome-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.welcome-list li {
  font-size: var(--text-base);
  font-family: var(--font-sans);
  color: var(--ink-black);
  position: relative;
  padding-left: var(--space-4);
}

.welcome-list li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--accent-rust);
}

.welcome-link {
  display: inline-block;
  color: var(--accent-rust);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  letter-spacing: var(--tracking-wide);
  transition: color var(--transition-base);
  border-bottom: 1px solid transparent;
  padding-bottom: 2px;
}

.welcome-link:hover {
  color: var(--accent-sage);
  border-bottom-color: var(--accent-sage);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .welcome-grid {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  .welcome-aside {
    padding-left: 0;
    padding-top: var(--space-6);
    border-left: none;
    border-top: 1px solid var(--warm-gray);
  }

  .welcome-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-2) var(--space-6);
  }
}

@media (max-width: 768px) {
  .welcome-section {
    padding: var(--space-8) 0;
  }

  .welcome-title {
    font-size: var(--text-2xl);
  }

  .welcome-list {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
}

@media (max-width: 480px) {
  .welcome-title {
    font-size: var(--text-xl);
    margin-bottom: var(--space-3);
  }

  .welcome-intro {
    font-size: var(--text-sm);
  }

  .welcome-list li {
    font-size: var(--text-sm);
  }

  .welcome-philosophy {
    font-size: var(--text-xs);
  }
}
</style>