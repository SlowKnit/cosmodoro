<template>
    <div class="text-wrapper">
        <div class="fade-container">
            <span class=scrolling-text>
                {{ text }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    text: string;
}>();
</script>

<style scoped>
.text-wrapper {
    position: absolute;
    bottom: 22%;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.scrolling-text {
    position: relative;
    display: inline-block;
    white-space: nowrap;
    animation: scroll-text 10s linear infinite;
    width: 100%;
    height: 100%;
}

.fade-container {
    z-index: 15;
    width: 100%;
    height: 30%;
    font-size: 30px;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
    mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

@keyframes scroll-text {
    from {
        transform: translateX(100%);
    }

    to {
        transform: translateX(-100%);
    }
}
</style>