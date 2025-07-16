<template>
  <div class="tv-wrapper" :style="{ width: `${scaledTVWidth}px`, height: `${scaledTVHeight}px` }">
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
    <img class="tv-frame" :src="TVImage" alt="TV Frame" @click="playVideo" />
    <div class="tv-volume-knob">
      <input type="range" min="0" max="100" step="1" v-model="volume"
        @input="setVolume(Number((($event.target as HTMLInputElement)?.value)))" aria-label="Volume" @click.stop />
    </div>
    <div class="tv-controls">
      <button class="tv-btn" :class="{ active: isLooping }" @click="isLooping = !isLooping" aria-label="Loop"
        title="Loop">
        <img :src="isLooping ? '/assets/icons/loop_on.png' : '/assets/icons/loop_off.png'" alt="Loop"
          class="loop-btn-img" />
      </button>
      <button class="tv-btn" @click="restartVideo" aria-label="Restart" title="Restart">
        <img src="/assets/icons/restart.png" alt="Restart" class="restart-btn-img" />
      </button>
    </div>
    <div class="tv-seek-controls">
      <button class="tv-btn" @click="seekBy(-10)" aria-label="Back 5s" title="Back 5s">
        <img src="/assets/icons/back.png" alt="Back 5s" class="seek-btn-img" />
      </button>
      <button class="tv-btn" @click="seekBy(10)" aria-label="Forward 5s" title="Forward 5s">
        <img src="/assets/icons/forward.png" alt="Forward 5s" class="seek-btn-img" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TVImage from '@/assets/tv.png';

const SCALE = 3;
const TV_SIZE = [100, 100] as const;
const TV_MIDDLE_OFFSET = [28, 45] as const;
const TV_MIDDLE_SIZE = [41, 39] as const;

const props = defineProps<{ videoId: string }>();

// Player States
const player = ref<YT.Player | null>(null);
const playerReady = ref(false);
const playerState = ref<YT.PlayerState | null>(null);
const isLooping = ref(false);
const volume = ref(50);

// TV screen dimensions
const screenTop = TV_MIDDLE_OFFSET[1] * SCALE;
const screenLeft = TV_MIDDLE_OFFSET[0] * SCALE;
const screenWidth = TV_MIDDLE_SIZE[0] * SCALE;
const screenHeight = TV_MIDDLE_SIZE[1] * SCALE;
const scaledTVWidth = TV_SIZE[0] * SCALE;
const scaledTVHeight = TV_SIZE[1] * SCALE;

// Load YouTube iframe API script
const loadYouTubeAPI = (): Promise<typeof YT> => {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
    } else {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);

      window.onYouTubeIframeAPIReady = () => {
        resolve(window.YT);
      };
    }
  });
};

// Initialize YT Player
const initPlayer = async () => {
  const YT = await loadYouTubeAPI();

  player.value = new YT.Player('tv-iframe', {
    height: screenHeight.toString(),
    width: screenWidth.toString(),
    videoId: props.videoId,
    events: {
      onReady: () => {
        playerReady.value = true;
        setVolume(volume.value);
      },
      onStateChange: (event: YT.OnStateChangeEvent) => {
        playerState.value = event.data;
        if (isLooping.value && event.data === YT.PlayerState.ENDED) {
          player.value?.seekTo(0, true);
          player.value?.playVideo();
        }
      },
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
    },
  });
};

// Controls
const playVideo = () => {
  if (!playerReady.value || !player.value) return;
  const state = player.value.getPlayerState();
  if (state === window.YT.PlayerState.PLAYING) {
    player.value.pauseVideo();
  } else {
    player.value.playVideo();
  }
};

const seekBy = (seconds: number) => {
  if (!playerReady.value || !player.value) return;
  const current = player.value.getCurrentTime();
  player.value.seekTo(current + seconds, true);
};

const restartVideo = () => {
  if (!playerReady.value || !player.value) return;
  player.value.seekTo(0, true);
  player.value.playVideo();
};

const setVolume = (v: number) => {
  volume.value = v;
  if (playerReady.value && player.value) {
    player.value.setVolume(v);
  }
};

onMounted(() => {
  initPlayer();
});
</script>

<style scoped>
.tv-wrapper {
  transition: filter 100ms;
  image-rendering: pixelated;
  position: absolute;
  top: 70%;
  right: 0;
  animation: float 64s ease-in-out infinite, spin 51s ease-in-out infinite;
  display: inline-block;
  justify-content: center;
  cursor: pointer;
  filter: drop-shadow(0 0 .2rem violet);
}

.tv-wrapper:hover {
  filter: drop-shadow(0 0 .4rem violet);
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

.tv-volume-knob {
  z-index: 3;
  position: relative;
  bottom: 15%;
  width: 120px;
  margin: 12px auto 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.tv-volume-knob input[type="range"] {
  width: 100%;
  height: 100%;
  accent-color: violet;
  cursor: pointer;
}

.tv-controls {
  position: absolute;
  bottom: 84%;
  height: 20%;
  z-index: 5;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 8px auto 0 auto;
  width: 100%;
}

.tv-btn {
  margin: 15%;
  background: #222;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  user-select: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.restart-btn-img {
  width: 48px;
  height: 48px;
  transition: transform 0.2s;
}

.restart-btn-img:hover {
  transform: scale(1.1);
}

.loop-btn-img {
  width: 36px;
  height: 36px;
  transition: transform 0.2s;
}

.loop-btn-img:hover {
  transform: scale(1.1);
}

.tv-btn:active {
  transform: scale(1.12);
}

.tv-controls,
.tv-volume-knob {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.tv-wrapper:hover .tv-controls,
.tv-wrapper:hover .tv-volume-knob {
  opacity: 1;
  pointer-events: auto;
  transition: opacity 1s;
}

.seek-btn-img {
  width: 36px;
  height: 36px;
  transition: transform 0.2s;
}

.seek-btn-img:hover {
  transform: scale(1.1);
}

.tv-seek-controls {
  z-index: 5;
  position: absolute;
  bottom: 45%;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.tv-wrapper:hover .tv-seek-controls {
  opacity: 1;
  pointer-events: auto;
  transition: opacity 1s;
}
</style>