<script setup lang="ts">
useHead({ title: 'Accueil | Studio Démo' })
</script>

<template>
  <div>
    <section class="hero">
      <!--
        perf-exception: animated blur on the hero background, requested by the art direction.
        Repaint limited to the hero area (contain: paint), animation disabled with prefers-reduced-motion.
      -->
      <div
        class="hero__background"
        aria-hidden="true"
      />
      <h1>Studio Démo</h1>
      <p>Expériences web, 3D temps réel et WebAR.</p>
    </section>

    <FaqSection />
    <NewsletterForm />
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 60vh;
  contain: paint;
  overflow: hidden;
}
.hero__background {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 40%, #6d5dfc, transparent 60%), #111;
  animation: hero-blur 6s ease-in-out infinite alternate;
}
@keyframes hero-blur {
  from { filter: blur(0); }
  to { filter: blur(12px); }
}
@media (prefers-reduced-motion: reduce) {
  .hero__background { animation: none; }
}
</style>
