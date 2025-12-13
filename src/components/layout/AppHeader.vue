<template>
  <header class="header">
    <BaseContainer>
      <nav class="nav">
        <router-link to="/" class="nav__logo">
          <HeatSyncLogo />
        </router-link>

        <div class="nav__center">
          <LabStatusIndicator class="nav__status" />
        </div>

        <ul class="nav__links">
          <li><router-link to="/about" class="nav__link">About</router-link></li>
          <li><router-link to="/membership" class="nav__link">Membership</router-link></li>
          <li><router-link to="/calendar" class="nav__link">Events</router-link></li>
          <li><a href="https://www.flickr.com/people/hslphotosync/" class="nav__link" target="_blank" rel="noopener">Projects</a></li>
          <li><a href="https://wiki.heatsynclabs.org" class="nav__link" target="_blank" rel="noopener">Wiki</a></li>
          <li><router-link to="/classes" class="nav__link">Classes</router-link></li>
          <li><router-link to="/support" class="nav__link">Support Us</router-link></li>
          <li class="nav__divider"></li>
          <li>
            <a href="https://discord.gg/2aWPgkeS6Q" class="nav__link nav__link--icon" target="_blank" rel="noopener" aria-label="Join our Discord">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/heatsynclabs/" class="nav__link nav__link--icon" target="_blank" rel="noopener" aria-label="Follow us on Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
              </svg>
            </a>
          </li>
        </ul>

        <button
          class="nav__mobile-toggle"
          @click="toggleMobileMenu"
          :aria-expanded="isMobileMenuOpen"
          aria-label="Toggle navigation menu"
        >
          <span class="nav__mobile-toggle-line"></span>
          <span class="nav__mobile-toggle-line"></span>
          <span class="nav__mobile-toggle-line"></span>
        </button>
      </nav>

      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="nav__mobile-menu">
        <ul class="nav__mobile-links">
          <li><router-link to="/about" class="nav__mobile-link" @click="closeMobileMenu">About</router-link></li>
          <li><router-link to="/membership" class="nav__mobile-link" @click="closeMobileMenu">Membership</router-link></li>
          <li><router-link to="/calendar" class="nav__mobile-link" @click="closeMobileMenu">Events</router-link></li>
          <li><a href="https://www.flickr.com/people/hslphotosync/" class="nav__mobile-link" target="_blank" rel="noopener">Projects</a></li>
          <li><a href="https://wiki.heatsynclabs.org" class="nav__mobile-link" target="_blank" rel="noopener">Wiki</a></li>
          <li><router-link to="/classes" class="nav__mobile-link" @click="closeMobileMenu">Classes</router-link></li>
          <li><router-link to="/support" class="nav__mobile-link" @click="closeMobileMenu">Support Us</router-link></li>
        </ul>
      </div>
    </BaseContainer>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseContainer from '../base/BaseContainer.vue'
import HeatSyncLogo from '../HeatSyncLogo.vue'
import LabStatusIndicator from './LabStatusIndicator.vue'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style scoped>
.header {
  background: var(--cream);
  border-bottom: 1px solid var(--warm-gray);
  box-shadow: 0 1px 4px var(--shadow-light);
  position: sticky;
  top: 0;
  z-index: var(--z-overlay);
}

.nav {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  height: var(--header-height);
  gap: var(--space-6);
}

.nav__logo {
  text-decoration: none;
  color: inherit;
  justify-self: start;
}

.nav__center {
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

.nav__status {
  display: inline-block;
}

.nav__links {
  display: flex;
  gap: var(--space-4);
  list-style: none;
  margin: 0;
  padding: 0;
  justify-self: end;
  align-items: center;
  flex-wrap: nowrap;
}

.nav__link {
  color: var(--graphite);
  text-decoration: none;
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  letter-spacing: var(--tracking-wide);
  transition: color var(--transition-base);
  position: relative;
  padding: var(--space-2) 0;
  white-space: nowrap;
}

.nav__link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--accent-rust);
  transition: width var(--transition-base);
}

.nav__link:hover,
.nav__link.router-link-active {
  color: var(--accent-rust);
}

.nav__link:hover::after,
.nav__link.router-link-active::after {
  width: 100%;
}

.nav__divider {
  width: 1px;
  height: 16px;
  background: var(--warm-gray);
  margin: 0 var(--space-1);
  opacity: 0.5;
}

.nav__link--icon {
  display: flex;
  align-items: center;
  padding: var(--space-1);
}

.nav__link--icon::after {
  display: none;
}

.nav__link--icon svg {
  width: 16px;
  height: 16px;
  transition: transform var(--transition-base);
}

.nav__link--icon:hover svg {
  transform: scale(1.1);
}

/* Mobile toggle button */
.nav__mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  padding: var(--space-2);
  cursor: pointer;
}

.nav__mobile-toggle-line {
  width: 20px;
  height: 2px;
  background: var(--graphite);
  transition: all var(--transition-base);
}

/* Mobile menu */
.nav__mobile-menu {
  display: none;
  background: var(--cream);
  border-top: 1px solid var(--warm-gray);
  padding: var(--space-4) 0;
}

.nav__mobile-links {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav__mobile-link {
  color: var(--graphite);
  text-decoration: none;
  font-size: var(--text-base);
  font-family: var(--font-mono);
  letter-spacing: var(--tracking-wide);
  padding: var(--space-3) 0;
  border-bottom: 1px solid transparent;
  transition: all var(--transition-base);
}

.nav__mobile-link:hover,
.nav__mobile-link.router-link-active {
  color: var(--accent-rust);
  border-bottom-color: var(--accent-rust);
}

/* Responsive */
@media (max-width: 1200px) {
  .nav__center {
    display: none; /* Hide lab status on smaller screens to prevent nav wrapping */
  }
}

@media (max-width: 768px) {
  .nav {
    display: flex;
    justify-content: space-between;
  }

  .nav__links {
    display: none;
  }

  .nav__center {
    display: none;
  }

  .nav__mobile-toggle {
    display: flex;
  }

  .nav__mobile-menu {
    display: block;
  }
}

/* Mobile toggle animation */
@media (max-width: 768px) {
  .nav__mobile-toggle[aria-expanded="true"] .nav__mobile-toggle-line:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .nav__mobile-toggle[aria-expanded="true"] .nav__mobile-toggle-line:nth-child(2) {
    opacity: 0;
  }

  .nav__mobile-toggle[aria-expanded="true"] .nav__mobile-toggle-line:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
}
</style>