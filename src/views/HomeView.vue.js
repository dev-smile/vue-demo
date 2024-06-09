import { ref, onMounted, onUnmounted } from 'vue';
export default (await import('vue')).defineComponent({
    setup() {
        const gameCanvas = ref(null); // canvas 엘리먼트 참조
        const width = 800; // canvas의 너비
        const height = 600; // canvas의 높이
        const context = ref(null); // canvas의 2D 렌더링 컨텍스트
        const mouseX = ref(0); // 마우스의 X 좌표
        const mouseY = ref(0); // 마우스의 Y 좌표
        // 공 객체
        const ball = ref({
            x: 50,
            y: 50,
            radius: 10,
            dx: 2,
            dy: 2,
            speed: 5 // 공의 이동 속도
        });
        // 공을 그리는 함수
        const drawBall = () => {
            const ctx = context.value;
            const { x, y, radius } = ball.value;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = 'blue';
            ctx.fill();
            ctx.closePath();
        };
        // 공과 마우스 포인터 간의 충돌 검사 함수
        const checkCollision = () => {
            const distX = ball.value.x - mouseX.value;
            const distY = ball.value.y - mouseY.value;
            const distance = Math.sqrt(distX * distX + distY * distY);
            return distance < ball.value.radius;
        };
        // 게임 상태를 업데이트하는 함수
        const updateGame = () => {
            const ctx = context.value;
            const { x, y, radius, dx, dy } = ball.value;
            ctx.clearRect(0, 0, width, height); // canvas를 지웁니다
            drawBall(); // 공을 그립니다
            // 공의 위치를 업데이트합니다
            ball.value.x += ball.value.dx;
            ball.value.y += ball.value.dy;
            // 경계 충돌 감지
            if (ball.value.x + ball.value.radius > width || ball.value.x - ball.value.radius < 0) {
                ball.value.dx = -ball.value.dx;
            }
            if (ball.value.y + ball.value.radius > height || ball.value.y - ball.value.radius < 0) {
                ball.value.dy = -ball.value.dy;
            }
            // 마우스 충돌 감지
            if (checkCollision()) {
                ball.value.dx = -ball.value.dx;
                ball.value.dy = -ball.value.dy;
            }
            // 애니메이션 프레임 요청
            requestAnimationFrame(updateGame);
        };
        // 마우스 이동 이벤트 핸들러
        const onMouseMove = (event) => {
            const rect = gameCanvas.value.getBoundingClientRect(); // canvas의 위치를 가져옵니다
            mouseX.value = event.clientX - rect.left; // 마우스의 X 좌표를 계산합니다
            mouseY.value = event.clientY - rect.top; // 마우스의 Y 좌표를 계산합니다
        };
        // 키 다운 이벤트 핸들러
        const onKeyDown = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    ball.value.y -= ball.value.speed;
                    break;
                case 'ArrowDown':
                    ball.value.y += ball.value.speed;
                    break;
                case 'ArrowLeft':
                    ball.value.x -= ball.value.speed;
                    break;
                case 'ArrowRight':
                    ball.value.x += ball.value.speed;
                    break;
            }
        };
        // 컴포넌트가 마운트될 때 실행되는 함수
        onMounted(() => {
            context.value = gameCanvas.value.getContext('2d'); // 2D 렌더링 컨텍스트를 가져옵니다
            updateGame(); // 게임 업데이트를 시작합니다
            window.addEventListener('keydown', onKeyDown); // 키 다운 이벤트 리스너 추가
        });
        // 컴포넌트가 언마운트될 때 실행되는 함수
        onUnmounted(() => {
            window.removeEventListener('keydown', onKeyDown); // 키 다운 이벤트 리스너 제거
        });
        return {
            gameCanvas,
            width,
            height,
            onMouseMove
        };
    }
});
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.canvas, __VLS_intrinsicElements.canvas)({ ...{ onMousemove: (__VLS_ctx.onMouseMove) }, ref: ("gameCanvas"), width: ((__VLS_ctx.width)), height: ((__VLS_ctx.height)), });
    // @ts-ignore
    (__VLS_ctx.gameCanvas);
    // @ts-ignore
    [onMouseMove, width, height, gameCanvas,];
    if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
    }
    var __VLS_slots;
    return __VLS_slots;
    const __VLS_componentsOption = {};
    const __VLS_name = undefined;
    const __VLS_internalComponent = (await import('./HomeView.vue')).default;
}
//# sourceMappingURL=HomeView.vue.js.map