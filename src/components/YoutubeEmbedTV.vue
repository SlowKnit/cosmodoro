<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TVImage from '@/assets/tv.png';
import ts from 'typescript';

const SCALE = 3;
const TV_SIZE = [100, 100];
const TV_MIDDLE_OFFSET = [28, 53];
const TV_MIDDLE_SIZE = [33, 23];

const props = defineProps<{ videoId: string }>();

const player = ref<any>(null);
const playerReady = ref(false);
const playerState = ref<number | null>(null);

const screenTop = TV_MIDDLE_OFFSET[1] * SCALE;
const screenLeft = TV_MIDDLE_OFFSET[0] * SCALE;
const screenWidth = TV_MIDDLE_SIZE[0] * SCALE;
const screenHeight = TV_MIDDLE_SIZE[1] * SCALE;
const scaledTVWidth = TV_SIZE[0] * SCALE;
const scaledTVHeight = TV_SIZE[1] * SCALE;

const loadYouTubeAPI = () => {
  return new Promise((resolve) => {
    //@ts-ignore;
    if (window.YT && window.YT.Player) {
      //@ts-ignore;
      resolve(window.YT);
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      //@ts-ignore;
      window.onYouTubeIframeAPIReady = () => {
        //@ts-ignore;
        resolve(window.YT);
      };
    }
  });
};

const initPlayer = async () => {
  const YT = await loadYouTubeAPI();
  //@ts-ignore;
  player.value = new YT.Player('tv-iframe', {
    height: screenHeight,
    width: screenWidth,
    videoId: props.videoId,
    events: {
      onReady: () => {
        playerReady.value = true;
      },
      onStateChange: (event: any) => {
        playerState.value = event.data;
      }
    },
    playerVars: {
      rel: 0,
      modestbranding: 1,
      controls: 0,
      showinfo: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      playsinline: 1,
    }
  });
};

const playVideo = () => {
  if (playerReady.value) {
    //@ts-ignore;
    if (player.value && player.value.getPlayerState() === YT.PlayerState.PLAYING) {
      player.value.pauseVideo();
    } else {
      player.value.playVideo();
    }
  }
};

onMounted(() => {
  initPlayer();
});
</script>

<template>
  <div class="tv-wrapper" :style="{ width: `${scaledTVWidth}px`, height: `${scaledTVHeight}px` }" @click="playVideo">
    <div class="tv-video" :style="{
      top: `${screenTop}px`,
      left: `${screenLeft}px`,
      width: `${screenWidth}px`,
      height: `${screenHeight}px`
    }">
      <div v-if="playerState !== 1" class="tv-noise-overlay">
        <img src="@/assets/tv-noise.gif" alt="Noise" />
      </div>
      <div :id="'tv-iframe'" class="no-pointer-events"></div>
    </div>
    <img class="tv-frame" :src="TVImage" alt="TV Frame" />
  </div>
</template>

<style scoped>
.tv-wrapper {
  transition: filter 500ms;
  image-rendering: pixelated;
  position: absolute;
  top: 70%;
  right: 0;
  animation: float 64s ease-in-out infinite, spin 51s ease-in-out infinite;
  display: inline-block;
  cursor: pointer;
  filter: drop-shadow(0 0 .25rem violet);
}

.tv-wrapper:hover {
  filter: drop-shadow(0 0 .5rem violet);
}

.tv-video {
  position: absolute;
  z-index: 1;
  pointer-events: none;
}

.tv-frame {
  position: relative;
  width: 100%;
  height: auto;
  z-index: 2;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

.no-pointer-events {
  pointer-events: none;
}

.tv-noise-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

.tv-noise-overlay img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
}

.hidden {
  display: none;
}

@keyframes float {

  0%,
  100% {
    transform: translate(-45%, -50%);
  }

  25% {
    transform: translate(-50%, -45%);
  }

  50% {
    transform: translate(-55%, -50%);
  }

  75% {
    transform: translate(-50%, -55%);
  }
}

@keyframes spin {

  0%,
  100% {
    rotate: -10deg;
  }

  50% {
    rotate: 10deg;
  }
}
</style>
