<template>
  <div class="membership-page">
    <BaseContainer>
      <div class="membership-content">
        <h1 class="membership-title">Become a Member</h1>

        <div class="membership-intro">
          <p>HeatSync Labs is a community workshop built and maintained by volunteers. We're a non-profit hackerspace that exists so people can learn, build, and share, together. Membership isn't required to use the lab during open hours, but it helps keep the lights on, the tools running, and the doors open for everyone.</p>

          <p>If you've ever wanted access to a full shop, a welcoming community, and a place to work on your ideas, membership is one way to make that happen.</p>
        </div>

        <section class="membership-section">
          <h2>Why Join</h2>

          <p>Your membership supports the space. It helps pay rent, keep equipment repaired, and make sure HeatSync stays open for the next person who needs it.</p>

          <p>Members get a few extra perks:</p>

          <ul>
            <li>A place to store your projects and tools (box or locker depending on level)</li>
            <li>A vote in lab decisions and elections</li>
            <li>Eligibility for card access after six months of involvement</li>
            <li>The satisfaction of keeping a unique local resource alive</li>
          </ul>

          <p>But mostly, you get to be part of a community that makes things happen. We don't have staff, just people who care enough to pitch in.</p>
        </section>

        <section class="membership-section">
          <h2>Membership Levels</h2>

          <div class="membership-tiers">
            <div class="tier">
              <h3>Associate — $25/month</h3>
              <p>Helps sustain the lab and includes a vote at Hack Your Hackerspace meetings. Great if you want to support the space and stay connected.</p>
            </div>

            <div class="tier">
              <h3>Basic — $50/month</h3>
              <p>Includes a storage box, a vote at Hack Your Hackerspace meetings, and eligibility for card access after six months. This is the most common tier for active members.</p>
            </div>

            <div class="tier">
              <h3>Plus — $100/month</h3>
              <p>Includes a locker and extra thanks for helping keep the lab thriving. Your support goes directly toward maintaining and improving the space.</p>
            </div>
          </div>
        </section>

        <section class="membership-section">
          <h2>How to Join</h2>

          <ol>
            <li>Come by during open hours and check out the space.</li>
            <li>Talk to members, work on something, and see how the lab runs.</li>
            <li>When you're ready, fill out the <a href="https://members.heatsynclabs.org/users/sign_up" class="membership-link" target="_blank" rel="noopener">Membership Application</a> and set up your monthly contribution.</li>
            <li>Once you're a member, you'll get access to a storage spot and can start joining votes at Hack Your Hackerspace nights.</li>
          </ol>

          <p>If you'd rather just visit or volunteer, that's fine too. You don't have to be a member to learn, teach, or build here.</p>
        </section>

        <section class="membership-section donation-section">
          <h2>Support HeatSync Labs</h2>

          <p>Not ready for membership but want to support the space? You can make a one-time or recurring donation to help keep HeatSync Labs running. Every contribution helps us maintain equipment, pay rent, and keep the doors open for our community.</p>

          <div class="donation-button-wrapper">
            <a href="https://www.zeffy.com/en-US/donation-form/donate-to-heatsync"
               class="donation-button"
               target="_blank"
               rel="noopener">
              Donate via Zeffy
            </a>
          </div>

          <p class="donation-note">Zeffy is a free donation platform that doesn't take any fees from your contribution. 100% of your donation goes directly to HeatSync Labs.</p>
        </section>

        <section class="membership-section">
          <h2>Volunteering and Involvement</h2>

          <p>HeatSync runs entirely on volunteer energy. Anyone can help by maintaining tools, cleaning up, teaching classes, hosting open hours, or just welcoming new faces. If you're not sure how to start, ask "How can I help?" and someone will point you in the right direction.</p>

          <p>We follow a "do-ocracy." If you see something that needs doing, and it makes the lab better, you're empowered to do it. Talk to people, communicate your ideas, and make it happen.</p>
        </section>

        <section class="membership-section">
          <h2>Hack Your Hackerspace</h2>

          <p>Twice a month, members gather for <strong>Hack Your Hackerspace (HYH)</strong>, a mix of short meeting and long work night. We vote on proposals, make improvements, and get stuff done. It's the best way to get involved and shape the future of the lab.</p>
        </section>

        <section class="membership-section">
          <h2>Card Access</h2>

          <p>After six months as a Basic or Plus member, you can be nominated for 24/7 card access. It's a privilege based on trust and participation, not just payment. Card access means the community knows you, trusts you, and believes you'll take care of the space as if it were your own.</p>
        </section>

        <section class="membership-section">
          <h2>Code of Conduct</h2>

          <p>We ask everyone to be excellent to each other. Treat people and tools with respect. Stay safe, be aware, and help keep the lab a welcoming place for everyone. Full details are in our <a href="#" class="membership-link">Code of Conduct</a>.</p>
        </section>

        <section class="membership-section">
          <h2>Questions?</h2>

          <p>Come visit during open hours. Ask questions, see what's being built, and meet the people who make HeatSync Labs work. You can also check our <a href="https://wiki.heatsynclabs.org" class="membership-link" target="_blank" rel="noopener">Wiki</a> or <a href="https://groups.google.com/forum/?fromgroups#!forum/heatsynclabs" class="membership-link" target="_blank" rel="noopener">Discussion Group</a> for more details.</p>

          <div class="social-links">
            <p>Connect with us online:</p>
            <ul class="social-list">
              <li><a href="http://bit.ly/hslslack" class="membership-link" target="_blank" rel="noopener">Join our Slack</a></li>
              <li><a href="https://www.instagram.com/heatsynclabs/?hl=en" class="membership-link" target="_blank" rel="noopener">Follow us on Instagram</a></li>
              <li><a href="https://www.facebook.com/HeatSyncLabs/" class="membership-link" target="_blank" rel="noopener">Like us on Facebook</a></li>
            </ul>
          </div>
        </section>
      </div>
    </BaseContainer>
  </div>
</template>

<script setup lang="ts">
import BaseContainer from '../components/base/BaseContainer.vue'
import StyledDonateButton from '../components/base/StyledDonateButton.vue'
</script>

<style scoped>
.membership-page {
  flex: 1;
  padding: var(--space-8) 0;
}

.membership-content {
  max-width: 800px;
  margin: 0 auto;
}

.membership-title {
  font-size: var(--text-4xl);
  font-weight: var(--font-light);
  margin-bottom: var(--space-8);
  color: var(--ink-black);
  font-family: var(--font-sans);
  text-align: center;
}

.membership-intro {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-8);
  color: var(--graphite);
  font-family: var(--font-sans);
}

.membership-section {
  margin-bottom: var(--space-8);
}

.membership-section h2 {
  font-size: var(--text-2xl);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-4);
  color: var(--ink-black);
  font-family: var(--font-sans);
  border-bottom: 2px solid var(--accent-rust);
  padding-bottom: var(--space-2);
}

.membership-section h3 {
  font-size: var(--text-xl);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-2);
  color: var(--accent-rust);
  font-family: var(--font-mono);
}

.membership-section p {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
  color: var(--graphite);
  font-family: var(--font-sans);
}

.membership-section ul,
.membership-section ol {
  margin-bottom: var(--space-4);
  padding-left: var(--space-6);
}

.membership-section li {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-2);
  color: var(--graphite);
  font-family: var(--font-sans);
}

.membership-tiers {
  display: grid;
  gap: var(--space-6);
}

.tier {
  background: var(--cream);
  padding: var(--space-6);
  border-radius: var(--radius-base);
  border-left: 4px solid var(--accent-sage);
}

.tier h3 {
  margin-bottom: var(--space-3);
}

.tier p {
  margin-bottom: 0;
}

.membership-link {
  color: var(--accent-rust);
  text-decoration: none;
  font-weight: var(--font-medium);
  transition: color var(--transition-base);
}

.membership-link:hover {
  color: var(--accent-sage);
  text-decoration: underline;
}

.social-links {
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--warm-gray);
}

.social-links p {
  font-weight: var(--font-medium);
  margin-bottom: var(--space-3);
}

.social-list {
  list-style: none;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.social-list li {
  margin-bottom: 0;
}

.support-section {
  background: var(--cream);
  padding: var(--space-6);
  border-radius: var(--radius-base);
  border-left: 4px solid var(--accent-rust);
  margin: var(--space-6) 0;
  text-align: center;
}

.support-section h3 {
  font-size: var(--text-xl);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-3);
  color: var(--accent-rust);
  font-family: var(--font-mono);
}

.support-section p {
  margin-bottom: var(--space-4);
  color: var(--graphite);
}

.donation-section {
  background: var(--cream);
  padding: var(--space-6);
  border-radius: var(--radius-base);
  border: 2px solid var(--accent-sage);
  text-align: center;
}

.donation-button-wrapper {
  margin: var(--space-6) 0;
}

.donation-button {
  display: inline-block;
  padding: var(--space-4) var(--space-8);
  background: var(--accent-rust);
  color: var(--off-white);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  font-family: var(--font-sans);
  text-decoration: none;
  border-radius: var(--radius-base);
  transition: all var(--transition-base);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.donation-button:hover {
  background: var(--accent-sage);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.donation-note {
  font-size: var(--text-sm);
  color: var(--warm-gray);
  font-style: italic;
}

@media (max-width: 768px) {
  .membership-page {
    padding: var(--space-4) 0;
  }

  .membership-title {
    font-size: var(--text-3xl);
  }

  .membership-intro {
    font-size: var(--text-base);
  }

  .membership-section h2 {
    font-size: var(--text-xl);
  }

  .tier {
    padding: var(--space-4);
  }
}
</style>