<script setup lang="ts">
import HeroSection from '../components/sections/HeroSection.vue'
import WelcomeSection from '../components/sections/WelcomeSection.vue'
import InfoSection from '../components/sections/InfoSection.vue'
import ScheduleSection from '../components/sections/ScheduleSection.vue'
import CalendarSection from '../components/sections/CalendarSection.vue'
import SupportSection from '../components/sections/SupportSection.vue'
</script>

<template>
  <div class="home">
    <HeroSection />
    <WelcomeSection />
    <InfoSection />
    <ScheduleSection />
    <CalendarSection />
    <SupportSection />
  </div>
</template>

<style scoped>
.home {
  flex: 1;
}
</style>
