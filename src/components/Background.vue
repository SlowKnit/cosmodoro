<template>
    <div class="background-wrapper">
        <div class="background" :class="{ break: isTimerActive && isOnBreak, focus: isTimerActive && !isOnBreak }">
            <div class="bg-layer"></div>
            <div class="bg-layer mirrored"></div>
            <div class="bg-layer"></div>
        </div>
    </div>
</template>


<script lang="ts" setup>
const props = defineProps<{
    isTimerActive: boolean,
    isOnBreak: boolean;
}>();

</script>

<style scoped>
.background-wrapper {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: -1;
}

.background {
    animation: scroll-bg 480s linear infinite;
    transition: filter 300ms;
    display: flex;
    width: 300%;
    height: 100%;
    position: absolute;
    inset: 0;
    will-change: transform;
}

.bg-layer {
    width: 100vw;
    height: 100vh;
    background-image: url('/assets/background.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    image-rendering: pixelated;
}

.bg-layer.mirrored {
    transform: scaleX(-1);
}

@keyframes scroll-bg {
    0% {
        transform: translateX(0%);
    }

    100% {
        transform: translateX(-66.66666%);
    }
}

.background.focus {
    filter: hue-rotate(-40deg);
}

.background.break {
    filter: hue-rotate(-100deg);

}
</style>
