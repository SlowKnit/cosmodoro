<template>
    <div>
        <!-- Zahnrad Button -->
        <button @click="isOpen = !isOpen" class="settings-toggle">
            <img src="/assets/icons/slide.png" alt="Settings" class="icon" />
        </button>

        <!-- Sidebar -->
        <transition name="slide">
            <div v-if="isOpen" class="sidebar">
                <label>settings</label>
                <div class="form-group">
                    <label class="label">focus(min)</label>
                    <NumberInput :numberValue="focusMinutes" v-on:update:number-value="onFocusTimeChanged" />
                </div>

                <div class="form-group">
                    <label class="label">break(min)</label>

                    <NumberInput :numberValue="breakMinutes" v-on:update:number-value="onBreakTimeChanged" />
                </div>

                <a href="https://ko-fi.com/slowknit" target="_blank" rel="noopener" class="support-button">
                    ko-fi
                </a>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NumberInput from './NumberInput.vue'
const isOpen = ref(false)

const props = defineProps<{
    focusMinutes: number;
    breakMinutes: number;
}>();
const emits = defineEmits<{
    (e: 'update:focusMinutes', value: number): void;
    (e: 'update:breakMinutes', value: number): void;
}>();

function onFocusTimeChanged(value: number) {
    emits('update:focusMinutes', value);
}
function onBreakTimeChanged(value: number) {
    emits('update:breakMinutes', value);
}

</script>

<style scoped>
@reference "tailwindcss";

.settings-toggle {
    @apply absolute top-4 right-4 bg-transparent border-none cursor-pointer;
    z-index: 1001;
}

.icon {
    image-rendering: pixelated;
    transition: transform 0.1s ease, filter 0.1s ease;
}

.icon:hover {
    transform: scale(1.1);
    filter: drop-shadow(0 0 .25rem violet);
}

.icon:active {
    transform: scale(1.2);
    filter: drop-shadow(0 0 .35rem violet);
    transition: transform 0.05s ease, filter 0.05s ease;
}

.form-group {
    @apply h-15 mb-10 flex flex-row;
}

.label {
    @apply text-center;
}

.icon {
    @apply w-15 h-15 text-white opacity-70 hover:opacity-100 transition;
}

.sidebar {
    @apply fixed top-0 right-0 h-full w-1/4 p-4 flex flex-col;
    background-color: #0e001f;
    z-index: 1000;
}

.input {
    @apply w-30 h-15 p-1 rounded border-none text-white text-center mb-30;
    font-size: 80px;
    font-family: 'monogram';
    background-color: #0e001f;
}

.support-button {
    @apply block h-8 bg-violet-800 hover:bg-violet-900 text-white py-2 px-4 rounded-md w-full mt-4 absolute bottom-10 text-xl;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from {
    transform: translateX(100%);
}

.slide-enter-to {
    transform: translateX(0%);
}

.slide-leave-from {
    transform: translateX(0%);
}

.slide-leave-to {
    transform: translateX(100%);
}
</style>
