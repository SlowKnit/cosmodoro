<template>
    <div>
        <!-- Zahnrad Button -->
        <button @click="isOpen = !isOpen" class="settings-toggle">
            <img src="/assets/icons/slide.png" alt="Settings" class="icon" />
        </button>

        <!-- Sidebar -->
        <transition name="slide">
            <div v-if="isOpen" class="sidebar">
                <label class="main-label">settings</label>
                <div class="form-group">
                    <label class="label">focus(min)</label>
                    <NumberInput :numberValue="focusMinutes" v-on:update:number-value="onFocusTimeChanged" />
                </div>

                <div class="form-group">
                    <label class="label">break(min)</label>

                    <NumberInput :numberValue="breakMinutes" v-on:update:number-value="onBreakTimeChanged" />
                </div>
                <span class="reset" @click="onReset">reset</span>

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

function onReset() {
    emits('update:focusMinutes', 25);
    emits('update:breakMinutes', 5);
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
    @apply text-center mr-4;
}

.icon {
    @apply w-15 h-15 text-white opacity-70 hover:opacity-100 transition;
}

.sidebar {
    @apply fixed top-0 right-0 h-full w-1/4 pl-4 pr-4 flex flex-col;
    background-color: #0e001f;
    min-width: 500px;
    z-index: 1000;
}

.input {
    @apply w-30 h-15 p-1 rounded border-none text-white text-center mb-30;
    font-size: 80px;
    font-family: 'monogram';
    background-color: #0e001f;
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

.main-label {
    @apply mb-10 top-0 underline;
}

.reset {
    transition: transform 0.05s ease, filter 0.1s ease;
    @apply cursor-pointer transition w-1 select-none;
}

.reset:hover {
    filter: drop-shadow(0 0 .25rem violet);
    transform: scale(1.05);
}

.reset:active {
    filter: drop-shadow(0 0 .35rem violet);
    transform: scale(1.1);
    transition: transform 0.05s ease, filter 0.05s ease;
}
</style>
