<template>
  <div id="game-container" ref="gameContainer"></div>
</template>

<script>
export default {
  name: 'Game',
  mounted() {
    this.sketch = new p5(this.gameSetup)
  },
  beforeDestroy() {
    if (this.sketch) {
      this.sketch.remove()
    }
  },
  methods: {
    gameSetup(p) {
      let player
      let obstacles = []
      let score = 0
      let gameOver = false

      p.setup = function () {
        p.createCanvas(800, 400).parent('game-container')
        player = new Player()
      }

      p.draw = function () {
        if (gameOver) {
          p.background(200, 0, 0)
          p.textAlign(p.CENTER)
          p.textSize(32)
          p.fill(255)
          p.text('Game Over', p.width / 2, p.height / 2)
          p.text(`Score: ${score}`, p.width / 2, p.height / 2 + 40)
          return
        }

        p.background(220)
        player.update()
        player.show()

        if (p.frameCount % 60 === 0) {
          obstacles.push(new Obstacle())
          score++
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
          obstacles[i].update()
          obstacles[i].show()

          if (player.hits(obstacles[i])) {
            gameOver = true
          }

          if (obstacles[i].offscreen()) {
            obstacles.splice(i, 1)
          }
        }

        p.textSize(16)
        p.fill(0)
        p.text(`Score: ${score}`, p.width - 100, 30)
      }

      p.keyPressed = function () {
        if (p.key == ' ' && !gameOver) {
          player.jump()
        }
        if (gameOver && p.key == 'R') {
          score = 0
          gameOver = false
          obstacles = []
          player = new Player()
        }
      }

      class Player {
        constructor() {
          this.r = 50
          this.x = 50
          this.y = p.height - this.r
          this.vy = 0
          this.gravity = 1
        }

        jump() {
          if (this.y == p.height - this.r) {
            this.vy = -20
          }
        }

        hits(obstacle) {
          return p.collideRectRect(
            this.x,
            this.y,
            this.r,
            this.r,
            obstacle.x,
            obstacle.y,
            obstacle.w,
            obstacle.h
          )
        }

        update() {
          this.y += this.vy
          this.vy += this.gravity
          this.y = p.constrain(this.y, 0, p.height - this.r)
        }

        show() {
          p.fill(255, 50, 50)
          p.rect(this.x, this.y, this.r, this.r)
        }
      }

      class Obstacle {
        constructor() {
          this.w = 40
          this.h = p.random(50, 150)
          this.x = p.width
          this.y = p.height - this.h
          this.speed = 6
        }

        update() {
          this.x -= this.speed
        }

        offscreen() {
          return this.x < -this.w
        }

        show() {
          p.fill(50, 50, 255)
          p.rect(this.x, this.y, this.w, this.h)
        }
      }
    }
  }
}
</script>

<style scoped>
#game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
