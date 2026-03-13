<template>
  <div class="particles-container">
    <vue-particles
      id="tsparticles"
      :options="particlesOptions"
      @particlesLoaded="particlesLoaded"
    />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const particlesOptions = {
  background: {
    color: { value: '#000' },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: { enable: true, mode: 'push' },
      onHover: { enable: true, mode: 'repulse' },
    },
    modes: {
      push: { quantity: 4 },
      repulse: { distance: 200, duration: 0.4 },
    },
  },
  particles: {
    color: { value: '#ffffff' },
    links: {
      color: '#ffffff',
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    move: {
      enable: true,
      speed: 6,
      direction: 'none',
      outModes: 'bounce',
    },
    number: { value: 80, density: { enable: true } },
    opacity: { value: 0.5 },
    shape: { type: 'circle' },
    size: { value: { min: 1, max: 5 } },
  },
  detectRetina: true,
}

const particlesLoaded = (container) => {
  console.log('Particles loaded:', container)
}
</script>

<style scoped>
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

#particles-js {
  width: 100%;
  height: 100%;
}
</style>
