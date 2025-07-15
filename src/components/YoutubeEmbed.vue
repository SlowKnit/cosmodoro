<script setup lang="ts">
import { defineProps, computed } from 'vue';
import TVImage from '@/assets/tv.png';

const SCALE = 3;

const TV_SIZE = [100, 100];              // Originalgröße in px
const TV_MIDDLE_OFFSET = [28, 53];       // Abstand von oben/links zum Bildschirm
const TV_MIDDLE_SIZE = [33, 23];         // Größe des sichtbaren Bereichs

const props = defineProps<{
  videoId: string;
}>();

const videoUrl = computed(() => `https://www.youtube.com/embed/${props.videoId}`);

// Skalierte Werte berechnen
const scaledTVWidth = TV_SIZE[0] * SCALE;
const scaledTVHeight = TV_SIZE[1] * SCALE;
const screenTop = TV_MIDDLE_OFFSET[1] * SCALE ;
const screenLeft = TV_MIDDLE_OFFSET[0] * SCALE;
const screenWidth = TV_MIDDLE_SIZE[0] * SCALE ;
const screenHeight = TV_MIDDLE_SIZE[1] * SCALE;
</script>

<template>
  <div
    class="tv-wrapper"
    :style="{ width: `${scaledTVWidth}px`, height: `${scaledTVHeight}px` }"
  >
    <iframe
      class="tv-video"
      :src="videoUrl"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      :style="{
        top: `${screenTop}px`,
        left: `${screenLeft}px`,
        width: `${screenWidth}px`,
        height: `${screenHeight}px`
      }"
    ></iframe>
    <img class="tv-frame" :src="TVImage" alt="TV Frame" />
  </div>
</template>

<style scoped>
.tv-wrapper {
  position: relative;
  display: inline-block;
}

.tv-video {
  position: absolute;
  z-index: 1;
  border: none;
}

.tv-frame {
  position: relative;
  width: 100%;
  height: auto;
  display: block;
  z-index: 2;
  pointer-events: none;
}
</style>
