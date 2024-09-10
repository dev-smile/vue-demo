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
        <!-- 낮은 도의 경우 보조선 추가 -->
        <line
          v-if="isLowDo(currentNote)"
          :x1="currentNote.x - 15"
          :x2="currentNote.x + 15"
          :y1="currentNote.y"
          :y2="currentNote.y"
          stroke="black"
          stroke-width="2"
        />
        <circle
          :cx="currentNote.x"
          :cy="currentNote.y"
          r="10"
          fill="black"
        />
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
        { x: 100, y: 150 }, // 낮은 도 (C)
        { x: 150, y: 140 }, // 낮은 레 (D)
        { x: 200, y: 130 }, // 미 (E)
        { x: 250, y: 120 }, // 파 (F)
        { x: 300, y: 110 }, // 솔 (G)
        { x: 350, y: 100 }, // 라 (A)
        { x: 400, y: 90 },  // 시 (B)
        { x: 450, y: 80 },  // 높은 도 (C)
        { x: 490, y: 70 },  // 높은 레 (D)
      ],
      currentNote: null,  // 현재 문제로 출제된 음표
      resultMessage: "",
      noteNames: ['도', '레', '미', '파', '솔', '라', '시', '높은 도', '높은 레'],
      frequencies: {
        '도': 261.63,       // 낮은 도 (C)
        '레': 293.66,       // 낮은 레 (D)
        '미': 329.63,       // 미 (E)
        '파': 349.23,       // 파 (F)
        '솔': 392.00,       // 솔 (G)
        '라': 440.00,       // 라 (A)
        '시': 493.88,       // 시 (B)
        '높은 도': 523.25,  // 높은 도 (C)
        '높은 레': 587.33,  // 높은 레 (D)
      },
      audioContext: null, // Web Audio API의 AudioContext
    };
  },
  mounted() {
    this.setRandomNote();  // 페이지가 로드될 때 첫 번째 랜덤 음표를 설정
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)(); // AudioContext 초기화
  },
  methods: {
    // 사용자가 선택한 음계를 확인
    checkAnswer(selectedNote) {
      const correctNote = this.getNoteName(this.currentNote.y);
      if (selectedNote === correctNote) {
        this.resultMessage = `정답입니다! ${correctNote} 입니다.`;
        this.playNoteSound(correctNote);  // 정답일 경우 해당 음 재생
        this.setRandomNote();  // 새로운 음표 출제
      } else {
        this.resultMessage = `틀렸습니다. 정답은 ${correctNote} 입니다.`;
      }
    },
    // 랜덤으로 새로운 음표 설정
    setRandomNote() {
      const randomIndex = Math.floor(Math.random() * this.notes.length);
      this.currentNote = this.notes[randomIndex];
      this.resultMessage = "";  // 새로운 문제로 넘어가면 메시지를 초기화
    },
    // y 좌표에 따라 도레미파솔라시도 음계 결정
    getNoteName(y) {
      const notePositions = [
        { y: 150, name: '도' },  // 낮은 도 (C)
        { y: 140, name: '레' },  // 낮은 레 (D)
        { y: 130, name: '미' },  // 미 (E)
        { y: 120, name: '파' },  // 파 (F)
        { y: 110, name: '솔' },  // 솔 (G)
        { y: 100, name: '라' },  // 라 (A)
        { y: 90,  name: '시' },  // 시 (B)
        { y: 80,  name: '높은 도' },  // 높은 도 (C)
        { y: 70,  name: '높은 레' },  // 높은 레 (D)
      ];

      let closestNote = notePositions.reduce((prev, curr) => {
        return Math.abs(curr.y - y) < Math.abs(prev.y - y) ? curr : prev;
      });

      return closestNote.name;
    },
    // Web Audio API로 음을 재생
    playNoteSound(note) {
      const frequency = this.frequencies[note];
      if (frequency) {
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine'; // 사인파 생성
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime); // 주파수 설정
        const gainNode = this.audioContext.createGain(); // 볼륨 조절을 위한 GainNode
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime); // 볼륨 설정
        oscillator.connect(gainNode); // 연결
        gainNode.connect(this.audioContext.destination); // 출력 연결
        oscillator.start(); // 소리 재생
        oscillator.stop(this.audioContext.currentTime + 0.3); // 1초 후 소리 정지
      }
    },
    // 낮은 도인지 확인하는 함수
    isLowDo(note) {
      return this.getNoteName(note.y) === '도' && note.y === 150;
    },
  },
};
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