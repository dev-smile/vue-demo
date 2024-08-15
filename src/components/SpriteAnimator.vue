<template>
    <div :style="spriteStyle" class="sprite"></div>
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
      scale: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        currentFrame: 0,
        direction: 2, // 0: Up, 1: Right, 2: Down, 3: Left
        isMoving: false,
        x: 200, // 캐릭터의 x 좌표
        y: 200, // 캐릭터의 y 좌표
        moveSpeed: 2, // 캐릭터의 이동 속도
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
          die: [40, 41, 42, 43]
        },
        pressedKeys: new Set() // 현재 눌린 키를 저장하는 Set
      }
    },
    computed: {
      spriteStyle() {
        return {
          width: `${this.frameWidth}px`,
          height: `${this.frameHeight}px`,
          backgroundImage: `url(${this.spriteSheet})`,
          backgroundPosition: `-${this.getCurrentAnimationFrame() * this.frameWidth}px -0px`,
          backgroundRepeat: 'no-repeat',
          transform: `scale(${this.scale})`, // 스프라이트의 크기를 조절
          transformOrigin: 'top left', // 변환 기준점 설정
          position: 'absolute',
          left: `${this.x}px`, // 캐릭터의 x 위치
          top: `${this.y}px` // 캐릭터의 y 위치
        }
      }
    },
    mounted() {
      this.startAnimation()
      window.addEventListener('keydown', this.handleKeydown)
      window.addEventListener('keyup', this.handleKeyup)
      this.updateMovement() // 움직임 업데이트 시작
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
        // 현재 누른 키에 따라 방향과 이동 상태를 업데이트합니다.
        if (this.pressedKeys.size === 0) {
          this.isMoving = false
          return
        }
  
        this.isMoving = true
        if (this.pressedKeys.has('ArrowUp')) {
          this.direction = 0 // Up
        }
        if (this.pressedKeys.has('ArrowRight')) {
          this.direction = 1 // Right
        }
        if (this.pressedKeys.has('ArrowDown')) {
          this.direction = 2 // Down
        }
        if (this.pressedKeys.has('ArrowLeft')) {
          this.direction = 3 // Left
        }
      },
      moveCharacter() {
        // 캐릭터의 위치를 업데이트합니다.
        if (this.pressedKeys.has('ArrowUp')) {
          this.y -= this.moveSpeed
        }
        if (this.pressedKeys.has('ArrowRight')) {
          this.x += this.moveSpeed
        }
        if (this.pressedKeys.has('ArrowDown')) {
          this.y += this.moveSpeed
        }
        if (this.pressedKeys.has('ArrowLeft')) {
          this.x -= this.moveSpeed
        }
      },
      updateMovement() {
        // 움직임을 지속적으로 업데이트합니다.
        this.moveCharacter()
        requestAnimationFrame(this.updateMovement) // 다음 프레임에 updateMovement를 호출합니다.
      }
    }
  }
  </script>
  
  <style scoped>
  .sprite {
    overflow: hidden;
  }
  </style>
  