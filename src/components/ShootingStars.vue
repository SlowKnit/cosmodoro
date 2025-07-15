<template>
    <canvas ref="canvas" class="shooting-canvas"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
const canvas = ref<HTMLCanvasElement | null>(null);

let ctx: CanvasRenderingContext2D;
let width = 0;
let height = 0;
let animationId: number;
const stars: ShootingStar[] = [];

interface ShootingStar {
    x: number;
    y: number;
    length: number;
    speed: number;
    angle: number;
    opacity: number;
}

function createShootingStar() {
    stars.push({
        x: Math.random() * width * 1.5 - 100,
        y: 0,
        length: Math.random() * 80 + 200,
        speed: Math.random() * 5 + 100,
        angle: Math.PI / 4,
        opacity: 1
    });
}

function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        const controlX = star.x - star.length * 0.5 * Math.cos(star.angle);
        const controlY = star.y - star.length * 0.5 * Math.sin(star.angle) - 20; // 20 = "Krümmung"

        ctx.quadraticCurveTo(
            controlX,
            controlY,
            star.x - star.length * Math.cos(star.angle),
            star.y - star.length * Math.sin(star.angle)
        );
        const gradient = ctx.createLinearGradient(star.x, star.y, star.x - star.length * Math.cos(star.angle), star.y - star.length * Math.sin(star.angle));
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`); // Schweif-Ende
        gradient.addColorStop(1, `rgba(255, 255, 255, ${star.opacity})`); // Kopf der Sternschnuppe
        ctx.strokeStyle = gradient;
        ctx.lineWidth = .3 + Math.random();
        ctx.stroke();

        star.x += star.speed;
        star.y += star.speed;
        star.opacity -= 0.01;

        if (star.opacity <= 0) {
            stars.splice(i, 1);
            i--;
        }
    }

    animationId = requestAnimationFrame(draw);
}

onMounted(() => {
    const el = canvas.value;
    if (!el) return;

    ctx = el.getContext('2d')!;
    width = el.width = window.innerWidth;
    height = el.height = window.innerHeight;

    const resize = () => {
        width = el.width = window.innerWidth;
        height = el.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);

    // Regelmäßig neue Sternschnuppen erzeugen
    const interval = setInterval(() => {
        if (Math.random() < 0.3) createShootingStar();
    }, 400);

    draw();

    onBeforeUnmount(() => {
        cancelAnimationFrame(animationId);
        clearInterval(interval);
        window.removeEventListener('resize', resize);
    });
});
</script>

<style scoped>
.shooting-canvas {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
}
</style>
