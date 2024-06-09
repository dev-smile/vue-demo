export default (await import('vue')).defineComponent({
    name: "Game", // Vue 컴포넌트의 이름을 'Game'으로 설정
    mounted() {
        this.sketch = new p5(this.gameSetup); // 컴포넌트가 마운트될 때 p5 인스턴스를 생성하고 gameSetup 메서드로 초기화
    },
    beforeDestroy() {
        if (this.sketch) {
            this.sketch.remove(); // 컴포넌트가 파괴되기 전 p5 인스턴스가 존재하면 제거
        }
    },
    methods: {
        gameSetup(p) {
            let player;
            let obstacles = [];
            let score = 0;
            let gameOver = false;
            p.setup = function () {
                p.createCanvas(800, 400).parent("game-container"); // p5 캔버스를 생성하고 game-container div 요소에 붙임
                player = new Player(); // Player 인스턴스를 생성
            };
            p.draw = function () {
                if (gameOver) {
                    p.background(200, 0, 0); // 게임 오버 시 배경을 빨간색으로 설정
                    p.textAlign(p.CENTER);
                    p.textSize(32);
                    p.fill(255);
                    p.text("Game Over", p.width / 2, p.height / 2); // 화면 중앙에 'Game Over' 텍스트 표시
                    p.text(`Score: ${score}`, p.width / 2, p.height / 2 + 40); // 점수 표시
                    return;
                }
                p.background(220); // 게임 진행 중 배경을 회색으로 설정
                player.update(); // player 상태 업데이트
                player.show(); // player 그리기
                if (p.frameCount % 60 === 0) {
                    obstacles.push(new Obstacle()); // 60프레임마다 새로운 장애물 생성
                    score++; // 점수 증가
                }
                for (let i = obstacles.length - 1; i >= 0; i--) {
                    obstacles[i].update(); // 각 장애물 상태 업데이트
                    obstacles[i].show(); // 각 장애물 그리기
                    if (player.hits(obstacles[i])) {
                        gameOver = true; // 플레이어가 장애물과 충돌하면 게임 오버
                    }
                    if (obstacles[i].offscreen()) {
                        obstacles.splice(i, 1); // 화면 밖으로 나간 장애물 제거
                    }
                }
                p.textSize(16);
                p.fill(0);
                p.text(`Score: ${score}`, p.width - 100, 30); // 현재 점수를 화면에 표시
            };
            p.keyPressed = function () {
                if (p.key == " " && !gameOver) {
                    player.jump(); // 스페이스바를 누르면 플레이어가 점프
                }
                if (gameOver && p.key == "R") {
                    score = 0;
                    gameOver = false;
                    obstacles = [];
                    player = new Player(); // 'R' 키를 누르면 게임이 리셋됨
                }
            };
            class Player {
                constructor() {
                    this.r = 50; // 플레이어의 크기 설정
                    this.x = 50; // 플레이어의 초기 x 위치 설정
                    this.y = p.height - this.r; // 플레이어의 초기 y 위치 설정
                    this.vy = 0; // 플레이어의 초기 속도 설정
                    this.gravity = 1; // 중력 설정
                }
                jump() {
                    if (this.y == p.height - this.r) {
                        this.vy = -20; // 플레이어가 바닥에 있을 때 점프
                    }
                }
                hits(obstacle) {
                    return p.collideRectRect(this.x, this.y, this.r, this.r, obstacle.x, obstacle.y, obstacle.w, obstacle.h); // 플레이어와 장애물의 충돌 검사
                }
                update() {
                    this.y += this.vy; // 플레이어의 y 위치 업데이트
                    this.vy += this.gravity; // 속도에 중력을 더함
                    this.y = p.constrain(this.y, 0, p.height - this.r); // 플레이어가 화면을 벗어나지 않도록 위치 제한
                }
                show() {
                    p.fill(255, 50, 50);
                    p.rect(this.x, this.y, this.r, this.r); // 플레이어 그리기
                }
            }
            class Obstacle {
                constructor() {
                    this.w = 40; // 장애물의 너비 설정
                    this.h = p.random(50, 150); // 장애물의 높이를 무작위로 설정
                    this.x = p.width; // 장애물의 초기 x 위치 설정
                    this.y = p.height - this.h; // 장애물의 y 위치 설정
                    this.speed = 6; // 장애물의 이동 속도 설정
                }
                update() {
                    this.x -= this.speed; // 장애물의 x 위치 업데이트
                }
                offscreen() {
                    return this.x < -this.w; // 장애물이 화면 밖으로 나갔는지 확인
                }
                show() {
                    p.fill(50, 50, 255);
                    p.rect(this.x, this.y, this.w, this.h); // 장애물 그리기
                }
            }
        },
    },
});
;
function __VLS_template() {
    let __VLS_ctx;
    /* Components */
    let __VLS_otherComponents;
    let __VLS_own;
    let __VLS_localComponents;
    let __VLS_components;
    let __VLS_styleScopedClasses;
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ id: ("game-container"), ref: ("gameContainer"), });
    // @ts-ignore
    (__VLS_ctx.gameContainer);
    // @ts-ignore
    [gameContainer,];
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    const __VLS_name = "Game";
    const __VLS_internalComponent = (await import('./AboutView.vue')).default;
}
//# sourceMappingURL=AboutView.vue.js.map