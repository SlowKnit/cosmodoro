<template>
    <header class="top-bar">
        <div class="top-content">
            cosmodoro
        </div>
    </header>
</template>

<script setup lang="ts">
</script>

<style scoped>

.top-bar {
    position: fixed;
    width: 100vw;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    box-shadow: none;
    z-index: 100;
}

.top-content {
    font-size: 80px;
    width: 100%;
    text-align: left;
    color: inherit;
    padding-left: 4rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    display: flex;
    align-items: center;
    height: 100%;
}
</style>
