<template>
  <div class="planet-wrapper">
    <SpritesheetPlayer :columns="120" :fps="60" :frame-count="1200" :loop="true" :frame-height="100" :frame-width="100"
      :sprite-url="planetImage" class="planet" @click="onClicked" />
  </div>
</template>

<script lang="ts" setup>
import planetImage from '@/assets/planet.png';
import SpritesheetPlayer from './SpritesheetPlayer.vue';

const emits = defineEmits<{
  (e: 'planet-clicked'): void;
}>();

function onClicked() {
  emits('planet-clicked');
}

</script>

<style scoped>
.planet-wrapper {
  align-self: center;
  align-items: center;
  display: flex;
  justify-content: center;
  width: 300px;
  height: 300px;
  padding: 15px 15px;
}

.planet {
  transition: filter 500ms, transform 1000ms;
  z-index: 10;
  transform: scale(3);
}

.planet:hover {
  filter: drop-shadow(0 0 .5rem cyan);
  transform: scale(3.1);
}

.planet:active {
  filter: drop-shadow(0 0 .75rem cyan);
  transform: scale(3.2);
  transition: scale 10ms;
}
</style>