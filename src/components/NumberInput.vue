<template>
    <span class="clickable" @click=changeValue(-1)>-</span>
    <div class="number-input">
        {{ numberValue }}
    </div>
    <span class="clickable" @click=changeValue(1)>+</span>

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

.number-input {
    @apply w-20 h-15 pb-10 rounded border-none flex flex-row justify-center underline;
    background-color: #0e001f;
}

.clickable {
    @apply cursor-pointer;
    transition: transform 0.1s ease, filter 0.1s ease;
    user-select: none;
}
.clickable:hover {
    transform: scale(1.1);
    filter: drop-shadow(0 0 .25rem violet);
}
</style>