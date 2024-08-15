<template>
  <div>
    <div :style="spriteStyle" class="sprite"></div>
    <!-- Bow animation -->
    <div v-if="isShooting" :style="bowStyle" class="bow"></div>
    <!-- Arrow -->
    <img v-if="arrowVisible" :src="arrowImage" :style="arrowStyle" class="arrow" />
  </div>
</template>

<script>
export default {
  props: {
    frameWidth: {
      type: Number,
      required: true
    },
    frameHeight: {
      type: Number,
      required: true
    },
    animationSpeed: {
      type: Number,
      default: 100
    },
    spriteSheet: {
      type: String,
      required: true
    },
    bowSpriteSheet: {
      type: String,
      required: true
    },
    arrowImage: {
      type: String,
      required: true
    },
    scale: {
      type: Number,
      default: 1
    },
    obstacles: {
      type: Array,
      default: () => []
    },
    mouseX: {
      type: Number,
      required: true
    },
    mouseY: {
      type: Number,
      required: true
    },
    shoot: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      currentFrame: 0,
      direction: 2,
      isMoving: false,
      isShooting: false,
      arrowVisible: false,
      arrowX: 0,
      arrowY: 0,
      x: 10, // Starting x position
      y: 10, // Starting y position
      moveSpeed: 2,
      bowFrameWidth: 48, // Updated bow frame width
      bowFrameHeight: 48, // Updated bow frame height
      frames: {
        idle: [
          [12, 13, 14, 15], // Up
          [8, 9, 10, 11], // Right
          [0, 1, 2, 3], // Down
          [4, 5, 6, 7] // Left
        ],
        move: [
          [34, 35, 36, 37, 38, 39], // Up
          [28, 29, 30, 31, 32, 33], // Right
          [16, 17, 18, 19, 20, 21], // Down
          [22, 23, 24, 25, 26, 27] // Left
        ],
        die: [40, 41, 42, 43],
        bow: [0, 1, 2, 3, 4, 5] // Bow animation frames
      },
      pressedKeys: new Set(),
      arrowAngle: 0
    }
  },
  watch: {
    shoot(newVal) {
      if (newVal) {
        this.startShooting()
      }
    }
  },
  computed: {
    spriteStyle() {
      return {
        width: `${this.frameWidth}px`,
        height: `${this.frameHeight}px`,
        backgroundImage: `url(${this.spriteSheet})`,
        backgroundPosition: `-${this.getCurrentAnimationFrame() * this.frameWidth}px 0px`,
        backgroundRepeat: 'no-repeat',
        transform: `scale(${this.scale})`,
        transformOrigin: 'top left',
        position: 'absolute',
        left: `${this.x}px`,
        top: `${this.y}px`
      }
    },
    bowStyle() {
      const angle = this.calculateAngle(
        this.x + (this.frameWidth * this.scale) / 2,
        this.y + (this.frameHeight * this.scale) / 2,
        this.mouseX,
        this.mouseY
      )
      return {
        width: `${this.bowFrameWidth}px`, // Use updated bow frame width
        height: `${this.bowFrameHeight}px`, // Use updated bow frame height
        backgroundImage: `url(${this.bowSpriteSheet})`,
        backgroundPosition: `-${this.frames.bow[this.currentFrame] * this.bowFrameWidth}px 0px`,
        backgroundRepeat: 'no-repeat',
        transform: `scale(${this.scale}) rotate(${angle + 180}deg)`,
        transformOrigin: 'center center',
        position: 'absolute',
        left: `${this.x}px`,
        top: `${this.y}px`,
        zIndex: 2, // Ensure it is above the character sprite
        pointerEvents: 'none' // Prevent interfering with mouse events
      }
    },
    arrowStyle() {
      return {
        position: 'absolute',
        left: `${this.arrowX}px`,
        top: `${this.arrowY}px`,
        width: `${3 * this.scale}px`,
        height: `${15 * this.scale}px`,
        transform: `rotate(${this.arrowAngle}deg)`,
        zIndex: 3 // Ensure arrow is above everything else
      }
    }
  },
  mounted() {
    this.startAnimation()
    window.addEventListener('keydown', this.handleKeydown)
    window.addEventListener('keyup', this.handleKeyup)
    this.updateMovement()
  },
  beforeUnmount() {
    this.stopAnimation()
    window.removeEventListener('keydown', this.handleKeydown)
    window.removeEventListener('keyup', this.handleKeyup)
  },
  methods: {
    startAnimation() {
      this.animationInterval = setInterval(() => {
        if (this.isMoving) {
          this.currentFrame = (this.currentFrame + 1) % this.frames.move[this.direction].length
        } else if (this.isShooting) {
          this.currentFrame = (this.currentFrame + 1) % this.frames.bow.length
          if (this.currentFrame === this.frames.bow.length - 1) {
            this.isShooting = false
            this.fireArrow()
          }
        } else {
          this.currentFrame = (this.currentFrame + 1) % this.frames.idle[this.direction].length
        }
      }, this.animationSpeed)
    },
    stopAnimation() {
      clearInterval(this.animationInterval)
    },
    getCurrentAnimationFrame() {
      if (this.isMoving) {
        return this.frames.move[this.direction][this.currentFrame]
      } else if (this.isShooting) {
        return this.frames.bow[this.currentFrame]
      } else {
        return this.frames.idle[this.direction][this.currentFrame]
      }
    },
    handleKeydown(event) {
      this.pressedKeys.add(event.key)
      this.updateDirectionAndMovement()
    },
    handleKeyup(event) {
      this.pressedKeys.delete(event.key)
      this.updateDirectionAndMovement()
    },
    updateDirectionAndMovement() {
      if (this.pressedKeys.size === 0) {
        this.isMoving = false
        return
      }

      this.isMoving = true
      if (this.pressedKeys.has('ArrowUp')) {
        this.direction = 0
      }
      if (this.pressedKeys.has('ArrowRight')) {
        this.direction = 1
      }
      if (this.pressedKeys.has('ArrowDown')) {
        this.direction = 2
      }
      if (this.pressedKeys.has('ArrowLeft')) {
        this.direction = 3
      }
    },
    moveCharacter() {
      let newX = this.x
      let newY = this.y

      if (this.pressedKeys.has('ArrowUp')) {
        newY -= this.moveSpeed
      }
      if (this.pressedKeys.has('ArrowRight')) {
        newX += this.moveSpeed
      }
      if (this.pressedKeys.has('ArrowDown')) {
        newY += this.moveSpeed
      }
      if (this.pressedKeys.has('ArrowLeft')) {
        newX -= this.moveSpeed
      }

      if (!this.isCollision(newX, newY)) {
        this.x = newX
        this.y = newY
      }
    },
    isCollision(newX, newY) {
      for (let obstacle of this.obstacles) {
        if (
          newX < obstacle.x + obstacle.width &&
          newX + this.frameWidth * this.scale > obstacle.x &&
          newY < obstacle.y + obstacle.height &&
          newY + this.frameHeight * this.scale > obstacle.y
        ) {
          return true
        }
      }
      return false
    },
    updateMovement() {
      this.moveCharacter()
      requestAnimationFrame(this.updateMovement)
    },
    calculateAngle(x1, y1, x2, y2) {
      const dx = x2 - x1
      const dy = y2 - y1
      const radians = Math.atan2(dy, dx)
      const degrees = radians * (180 / Math.PI)
      return degrees + 90 // Adjust to match the rotation angle for the bow
    },
    startShooting() {
      if (this.isShooting) return

      this.isShooting = true
      this.arrowVisible = false // Hide the arrow until it's shot
      this.currentFrame = 0 // Reset bow animation frame
    },
    fireArrow() {
      this.arrowVisible = true
      const centerX = this.x + (this.frameWidth * this.scale) / 2
      const centerY = this.y + (this.frameHeight * this.scale) / 2
      this.arrowX = centerX
      this.arrowY = centerY

      this.arrowAngle = this.calculateAngle(centerX, centerY, this.mouseX, this.mouseY)
      const angleRad = (this.arrowAngle - 90) * (Math.PI / 180)
      const arrowSpeed = 5

      const moveArrow = () => {
        this.arrowX += arrowSpeed * Math.cos(angleRad)
        this.arrowY += arrowSpeed * Math.sin(angleRad)

        if (
          this.arrowX < 0 ||
          this.arrowX > window.innerWidth ||
          this.arrowY < 0 ||
          this.arrowY > window.innerHeight
        ) {
          this.arrowVisible = false
          return
        }
        requestAnimationFrame(moveArrow)
      }
      moveArrow()
    }
  }
}
</script>

<style scoped>
.sprite {
  overflow: hidden;
}

.bow {
  z-index: 2; /* Ensure the bow is above the character */
}

.arrow {
  z-index: 3; /* Ensure the arrow is above everything else */
}
</style>
