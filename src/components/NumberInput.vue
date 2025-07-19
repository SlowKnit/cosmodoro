<template>
    <div class="wrapper">
        <span class="clickable" @click=changeValue(-1)>-</span>
        <div class="number-input">
            {{ numberValue }}
        </div>
        <span class="clickable" @click=changeValue(1)>+</span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    numberValue: number;
}>();

const emit = defineEmits<{
    (e: 'update:numberValue', value: number): void;
}>();

function changeValue(delta: number) {
    const newValue = props.numberValue + delta;
    if (newValue > 0) {
        emit('update:numberValue', newValue);
    }
}
</script>

<style scoped>
@reference "tailwindcss";

.wrapper {
    @apply flex flex-row items-center mt-10 justify-center right-4;
}

.number-input {
    @apply w-20 h-15 pl-2 pr-2 pb-10 rounded border-none flex flex-row justify-center underline;
    background-color: #0e001f;
}

.clickable {
    @apply cursor-pointer pb-4 select-none;
    transition: transform 0.1s ease, filter 0.1s ease;
}

.clickable:hover {
    transform: scale(1.1);
    filter: drop-shadow(0 0 .25rem violet);
    transition: transform 0.01s ease, filter 0.01s ease;
}

.clickable:active {
    filter: drop-shadow(0 0 .35rem violet);
    transform: scale(1.2);
    transition: transform 0.1s ease, filter 0.1s ease;

}
</style>