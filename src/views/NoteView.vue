<template>
  <div class="music-sheet">
    <!-- 오선지 -->
    <svg width="500" height="200">
      <g v-for="(line, index) in 5" :key="index">
        <line
          :y1="50 + index * 20"
          :y2="50 + index * 20"
          x1="10"
          x2="490"
          stroke="black"
          stroke-width="2"
        />
      </g>
      <!-- 현재 음표 -->
      <g v-if="currentNote">
        <circle :cx="currentNote.x" :cy="currentNote.y" r="10" fill="black" />
      </g>
    </svg>

    <!-- 음계 선택 버튼 -->
    <div class="note-buttons">
      <button v-for="note in noteNames" :key="note" @click="checkAnswer(note)">
        {{ note }}
      </button>
    </div>

    <p v-if="resultMessage">{{ resultMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notes: [
        { x: 100, y: 110 }, // 솔 (G)
        { x: 150, y: 90 }, // 시 (B)
        { x: 200, y: 70 }, // 레 (D)
        { x: 250, y: 80 }, // 도 (C)
        { x: 300, y: 60 } // 미 (E)
      ],
      currentNote: null, // 현재 문제로 출제된 음표
      resultMessage: '',
      noteNames: ['도', '레', '미', '파', '솔', '라', '시']
    }
  },
  mounted() {
    this.setRandomNote() // 페이지가 로드될 때 첫 번째 랜덤 음표를 설정
  },
  methods: {
    // 사용자가 선택한 음계를 확인
    checkAnswer(selectedNote) {
      const correctNote = this.getNoteName(this.currentNote.y)
      if (selectedNote === correctNote) {
        this.resultMessage = `정답입니다! ${correctNote} 입니다.`
        this.setRandomNote() // 정답일 경우 새로운 랜덤 음표 설정
      } else {
        this.resultMessage = `틀렸습니다. 정답은 ${correctNote} 입니다.`
      }
    },
    // 랜덤으로 새로운 음표 설정
    setRandomNote() {
      const randomIndex = Math.floor(Math.random() * this.notes.length)
      this.currentNote = this.notes[randomIndex]
      this.resultMessage = '' // 새로운 문제로 넘어가면 메시지를 초기화
    },
    // y 좌표에 따라 도레미파솔라시도 음계 결정
    getNoteName(y) {
      const notePositions = [
        { y: 130, name: '미' }, // E
        { y: 120, name: '파' }, // F
        { y: 110, name: '솔' }, // G
        { y: 100, name: '라' }, // A
        { y: 90, name: '시' }, // B
        { y: 80, name: '도' }, // C
        { y: 70, name: '레' }, // D
        { y: 60, name: '미' }, // E
        { y: 50, name: '파' } // F
      ]

      let closestNote = notePositions.reduce((prev, curr) => {
        return Math.abs(curr.y - y) < Math.abs(prev.y - y) ? curr : prev
      })

      return closestNote.name
    }
  }
}
</script>

<style scoped>
.music-sheet {
  margin-top: 20px;
  text-align: center;
}
.note-buttons {
  margin-top: 10px;
}
.note-buttons button {
  margin: 5px;
  padding: 10px;
  font-size: 16px;
}
</style>
