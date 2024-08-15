<template>
  <div>
    <p>방향키 입력으로 캐릭터를 움직일 수 있습니다.</p>
    <SpriteAnimator
      :frameWidth="24"
      :frameHeight="24"
      :animationSpeed="100"
      :spriteSheet="spriteSheetPath"
      :scale="2"
    />
  </div>
</template>

<script>
import SpriteAnimator from '@/components/SpriteAnimator.vue'
import spriteSheetPath from '@/assets/Girl-Sheet.png' // 스프라이트 시트 경로

export default {
  name: 'App',
  components: {
    SpriteAnimator
  },
  data() {
    return {
      spriteSheetPath
    }
  }
}
</script>

<style>
/* p {
  text-align: center;
  margin-top: 2rem;
} */
</style>
