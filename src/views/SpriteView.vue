<template>
  <div id="app">
    <!-- Background container -->
    <div class="background"></div>

    <!-- Sprite Animator and Obstacles -->
    <SpriteAnimator
      :frameWidth="24"
      :frameHeight="24"
      :animationSpeed="100"
      :spriteSheet="spriteSheetPath"
      :scale="2"
      :obstacles="obstacles"
    />
    <div
      v-for="(obstacle, index) in obstacles"
      :key="index"
      :style="getObstacleStyle(obstacle)"
      class="obstacle"
    ></div>
  </div>
</template>

<script>
import SpriteAnimator from '@/components/SpriteAnimator.vue'
import spriteSheetPath from '@/assets/Character/Girl-Sheet.png'

export default {
  name: 'App',
  components: {
    SpriteAnimator
  },
  data() {
    return {
      spriteSheetPath,
      obstacles: [
        { x: 100, y: 100, width: 50, height: 50 },
        { x: 200, y: 150, width: 50, height: 50 },
        { x: 150, y: 300, width: 50, height: 50 }
      ]
    }
  },
  methods: {
    getObstacleStyle(obstacle) {
      return {
        position: 'absolute',
        left: `${obstacle.x}px`,
        top: `${obstacle.y}px`,
        width: `${obstacle.width}px`,
        height: `${obstacle.height}px`
        // backgroundColor: 'rgba(255, 0, 0, 0.5)'
      }
    }
  }
}
</script>

<style>
/* #app {
  position: relative;
  width: 100%;
  height: 96vh;
  overflow: hidden;
} */

/* Background styling */
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/Map/TX Tileset Grass.png');
  background-repeat: repeat;
  z-index: -1; /* Ensure background is behind other elements */
}

.obstacle {
  background-image: url('@/assets/Map/TX Plant.png'), url('@/assets/Map/TX Shadow Plant.png');
  background-repeat: no-repeat;
  background-position: -215px -180px;
}
</style>
