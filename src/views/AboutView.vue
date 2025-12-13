<template>
  <div class="about">
    <BaseContainer>
      <section class="about__hero">
        <h1 class="about__title">About HeatSync Labs</h1>
        <p class="about__subtitle">
          Mesa's premier community hackerspace, fostering innovation and collaboration since 2009.
        </p>
      </section>

      <section class="about__content">
        <div class="about__grid">
          <div class="about__story">
            <h2 class="about__section-title">Our Story</h2>
            <p class="about__text">
              HeatSync Labs began as a grassroots effort to create a collaborative workspace
              where makers, artists, and technologists could come together to create, learn,
              and share knowledge. What started as a small group of passionate individuals
              has grown into Mesa's premier hackerspace.
            </p>
            <p class="about__text">
              As a 501(c)3 non-profit organization, we're member-owned and operated,
              ensuring that our community's needs always come first. Our 3,200 square
              foot facility houses everything from 3D printers and laser cutters to
              traditional woodworking and metalworking tools.
            </p>
          </div>

          <div class="about__mission">
            <h2 class="about__section-title">Our Mission</h2>
            <p class="about__text">
              To provide an open, inclusive environment where creativity and technical
              education thrive. We believe in the power of community-driven learning
              and the importance of hands-on experience in developing both technical
              skills and innovative thinking.
            </p>
          </div>
        </div>
      </section>

      <section class="about__location" id="visit-us">
        <h2 class="about__section-title">Visit Us</h2>
        <div class="location__content">
          <div class="location__info">
            <h3 class="location__title">HeatSync Labs</h3>
            <address class="location__address">
              108 W Main St<br>
              Mesa, AZ 85201
            </address>
            <div class="location__details">
              <p>Located in the heart of downtown Mesa, we're easily accessible by public transit and have street parking available.</p>
            </div>
          </div>
          <div class="location__map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.8474982729943!2d-111.8346!3d33.4146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872ba5b4f0c2d4d7%3A0x123456789abcdef0!2s108%20W%20Main%20St%2C%20Mesa%2C%20AZ%2085201!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="300"
              style="border:0; border-radius: var(--radius-base);"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              class="location__iframe"
            ></iframe>
          </div>
        </div>
      </section>
    </BaseContainer>
  </div>
</template>

<script setup lang="ts">
import BaseContainer from '../components/base/BaseContainer.vue'
</script>

<style scoped>
.about {
  flex: 1;
  padding: var(--space-16) 0;
}

.about__hero {
  text-align: center;
  margin-bottom: var(--space-16);
}

.about__title {
  font-size: var(--text-5xl);
  font-weight: var(--font-light);
  margin-bottom: var(--space-4);
  color: var(--ink-black);
  font-family: var(--font-mono);
}

.about__subtitle {
  font-size: var(--text-xl);
  color: var(--warm-gray);
  font-family: var(--font-sans);
  max-width: 600px;
  margin: 0 auto;
}

.about__content {
  max-width: 800px;
  margin: 0 auto;
}

.about__grid {
  display: grid;
  gap: var(--space-12);
}

.about__section-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-4);
  color: var(--accent-rust);
  font-family: var(--font-mono);
}

.about__text {
  font-size: var(--text-base);
  line-height: var(--leading-loose);
  color: var(--graphite);
  font-family: var(--font-sans);
  margin-bottom: var(--space-4);
}

.about__text:last-child {
  margin-bottom: 0;
}

.about__location {
  margin-top: var(--space-16);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.location__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
  align-items: start;
}

.location__title {
  font-size: var(--text-xl);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-2);
  color: var(--ink-black);
  font-family: var(--font-mono);
}

.location__address {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--graphite);
  font-family: var(--font-mono);
  font-style: normal;
  margin-bottom: var(--space-4);
}

.location__details p {
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--warm-gray);
  font-family: var(--font-sans);
}

.location__map {
  background: var(--warm-gray);
  border-radius: var(--radius-base);
  overflow: hidden;
  box-shadow: 0 4px 6px var(--shadow-light);
}

.location__iframe {
  display: block;
  width: 100%;
  height: 300px;
}

@media (max-width: 768px) {
  .about {
    padding: var(--space-12) 0;
  }

  .about__title {
    font-size: var(--text-4xl);
  }

  .about__subtitle {
    font-size: var(--text-lg);
  }

  .location__content {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  .location__iframe {
    height: 250px;
  }
}
</style>
