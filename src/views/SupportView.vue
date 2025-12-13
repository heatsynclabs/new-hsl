<template>
  <div class="support-page">
    <BaseContainer>
      <div class="support-content">
        <h1 class="support-title">Support HeatSync Labs</h1>

        <div class="support-intro">
          <p>HeatSync Labs thrives because of community support. There are several ways you can help keep our doors open and our tools running for everyone to enjoy.</p>
        </div>

        <section class="support-section">
          <h2>Ways to Support Us</h2>

          <div class="support-methods">
            <div class="method">
              <h3>Monthly Membership</h3>
              <p>The most impactful way to support HeatSync Labs is to <router-link to="/membership" class="support-link">become a member</router-link>. Members get access to storage, voting rights, and the satisfaction of directly supporting our mission.</p>
              <BaseButton variant="primary" to="/membership">Join as Member</BaseButton>
            </div>

            <div class="method">
              <h3>One-Time Donation</h3>
              <p>Make a one-time contribution through PayPal. Every dollar helps us maintain equipment, pay rent, and keep the space accessible to everyone.</p>
              <StyledDonateButton />
            </div>

            <div class="method">
              <h3>Cash or Check</h3>
              <p>Prefer to donate in person? You can bring cash or a check directly to any member at the lab during open hours. Make checks payable to "HeatSync Labs".</p>
              <div class="method-details">
                <p><strong>Our Address:</strong><br>
                108 W Main St<br>
                Mesa, AZ 85201</p>
              </div>
            </div>

            <div class="method">
              <h3>Shop Our eBay Store</h3>
              <p>Purchase items from our eBay store. We sell surplus equipment, member projects, and other interesting finds. Every purchase helps fund our operations.</p>
              <BaseButton variant="secondary" href="https://www.ebay.com/usr/heatsynclabs" target="_blank" rel="noopener">
                Visit eBay Store
              </BaseButton>
            </div>

            <div class="method">
              <h3>Equipment Donations</h3>
              <p>Have tools or equipment you no longer need? We accept donations of working tools, electronics, raw materials, and other items that benefit our community. Contact us first to ensure we can use your donation.</p>
              <div class="contact-info">
                <p>Email us or stop by during open hours to discuss equipment donations.</p>
              </div>
            </div>

            <div class="method">
              <h3>Corporate Sponsorship</h3>
              <p>Interested in corporate sponsorship opportunities? We offer various sponsorship levels for businesses that want to support maker education and community development in Mesa.</p>
              <div class="contact-info">
                <p>Contact us to learn about sponsorship packages and benefits.</p>
              </div>
            </div>
          </div>
        </section>

        <section class="support-section">
          <h2>Why Your Support Matters</h2>
          <div class="impact-grid">
            <div class="impact-item">
              <h4>Equipment Maintenance</h4>
              <p>Keeps our 3D printers, laser cutters, and workshop tools in working condition.</p>
            </div>
            <div class="impact-item">
              <h4>Facility Costs</h4>
              <p>Covers rent, utilities, and insurance for our 3,200 square foot facility.</p>
            </div>
            <div class="impact-item">
              <h4>Community Access</h4>
              <p>Ensures the space remains open and accessible to everyone during public hours.</p>
            </div>
            <div class="impact-item">
              <h4>Educational Programs</h4>
              <p>Supports classes, workshops, and educational initiatives for all skill levels.</p>
            </div>
          </div>
        </section>

        <section class="support-section">
          <h2>Thank You</h2>
          <p class="thank-you-text">
            HeatSync Labs exists because of supporters like you. Whether you become a member, make a donation, or simply spread the word about what we do, you're helping to build something special in Mesa. Thank you for being part of our community.
          </p>
        </section>
      </div>
    </BaseContainer>
  </div>
</template>

<script setup lang="ts">
import BaseContainer from '../components/base/BaseContainer.vue'
import BaseButton from '../components/base/BaseButton.vue'
import StyledDonateButton from '../components/base/StyledDonateButton.vue'
</script>

<style scoped>
.support-page {
  flex: 1;
  padding: var(--space-8) 0;
}

.support-content {
  max-width: 800px;
  margin: 0 auto;
}

.support-title {
  font-size: var(--text-4xl);
  font-weight: var(--font-light);
  margin-bottom: var(--space-8);
  color: var(--ink-black);
  font-family: var(--font-sans);
  text-align: center;
}

.support-intro {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-12);
  color: var(--graphite);
  font-family: var(--font-sans);
  text-align: center;
}

.support-section {
  margin-bottom: var(--space-12);
}

.support-section h2 {
  font-size: var(--text-2xl);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-6);
  color: var(--ink-black);
  font-family: var(--font-sans);
  border-bottom: 2px solid var(--accent-rust);
  padding-bottom: var(--space-2);
}

.support-methods {
  display: grid;
  gap: var(--space-8);
}

.method {
  background: var(--cream);
  padding: var(--space-6);
  border-radius: var(--radius-base);
  border-left: 4px solid var(--accent-sage);
}

.method h3 {
  font-size: var(--text-xl);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-3);
  color: var(--accent-rust);
  font-family: var(--font-mono);
}

.method p {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
  color: var(--graphite);
  font-family: var(--font-sans);
}

.method-details,
.contact-info {
  background: var(--paper-white);
  padding: var(--space-4);
  border-radius: var(--radius-sm);
  margin-top: var(--space-4);
}

.method-details p,
.contact-info p {
  margin-bottom: 0;
  font-size: var(--text-sm);
  color: var(--warm-gray);
}

.support-link {
  color: var(--accent-rust);
  text-decoration: none;
  font-weight: var(--font-medium);
  transition: color var(--transition-base);
}

.support-link:hover {
  color: var(--accent-sage);
  text-decoration: underline;
}

.impact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-6);
}

.impact-item {
  text-align: center;
  padding: var(--space-4);
}

.impact-item h4 {
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-2);
  color: var(--accent-rust);
  font-family: var(--font-mono);
}

.impact-item p {
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--graphite);
  font-family: var(--font-sans);
}

.thank-you-text {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--graphite);
  font-family: var(--font-sans);
  text-align: center;
  font-style: italic;
}

@media (max-width: 768px) {
  .support-page {
    padding: var(--space-4) 0;
  }

  .support-title {
    font-size: var(--text-3xl);
  }

  .support-intro {
    font-size: var(--text-base);
  }

  .impact-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .method {
    padding: var(--space-4);
  }
}
</style>