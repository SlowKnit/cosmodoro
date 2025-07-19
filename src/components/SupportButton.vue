<template>
    <a href="https://ko-fi.com/slowknit" target="_blank" rel="noopener" class="support-button">
        <label class="supp-label">support me on</label>
        <img src="/assets/icons/kofi_logo.svg" alt="Ko-fi" class="kofi-icon" />
    </a>
</template>
<style scoped>
.support-button {
    @apply absolute bottom-4 w-full h-12 bg-violet-800 hover:bg-violet-900 text-white rounded flex items-center mt-4 pl-10;
    transition: transform 0.3s ease, filter 0.3s ease, background-color 0.3s ease;
    border-radius: 12px;

}

.support-button:hover {
    filter: drop-shadow(0 0 .5rem violet);
}

a {
    @apply no-underline;
}

label.supp-label {
    @apply mr-2;
    font-size: 30px;
}

.kofi-icon {
    @apply w-20 h-full;
}
</style>