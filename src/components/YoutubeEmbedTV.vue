<template>
  <div class="tv-wrapper" :style="{ width: `${scaledTVWidth}px`, height: `${scaledTVHeight}px` }"
    @mouseover="onHover(true)" @mouseleave="onHover(false)">
    <ScrollingText :text="videoName" />
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
      <button class="tv-btn" @click="playRandomVideo" aria-label="Random" title="Random">
        <img src="/assets/icons/shuffle.png" alt="Random" class="restart-btn-img" />
      </button>
      <div class="crt-scanlines"></div>
      <button class="tv-btn" @click="restartVideo" aria-label="Restart" title="Restart">
        <img src="/assets/icons/restart.png" alt="Restart" class="restart-btn-img" />
      </button>
    </div>
    <div class="tv-seek-controls">
      <button class="tv-btn" @click="seekBy(-10)" aria-label="10s back" title="10s back">
        <img src="/assets/icons/back.png" alt="10s back" class="seek-btn-img" />
      </button>
      <button class="tv-btn" @click="seekBy(10)" aria-label="10s forward" title="10s forward">
        <img src="/assets/icons/forward.png" alt="10s forward" class="seek-btn-img" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Ref } from 'vue';
import TVImage from '@/assets/tv.png';
import ScrollingText from './ScrollingText.vue';
import '../assets/styles/yt-tv-style.css';

// Constants
const SCALE = 3;
const TV_SIZE = [100, 100];
const TV_MIDDLE_OFFSET = [23, 45];
const TV_MIDDLE_SIZE = [42, 39];
const screenTop = TV_MIDDLE_OFFSET[1] * SCALE;
const screenLeft = TV_MIDDLE_OFFSET[0] * SCALE;
const screenWidth = TV_MIDDLE_SIZE[0] * SCALE;
const screenHeight = TV_MIDDLE_SIZE[1] * SCALE;
const scaledTVWidth = TV_SIZE[0] * SCALE;
const scaledTVHeight = TV_SIZE[1] * SCALE;

// Video Data
const videoMeta: Record<string, string> = {
  'Uu1bK20sEF8': 'slowerpace 音楽 – 香り ep',
  '57UjISiPM7w': 'slowerpace 音楽 – SPACE COWBOYS',
  'Bu9Ia0n95rM': 'slowerpace 音楽 – Barbershop Simulator™',
  'q0Dd684xc2E': 'Macroblank - 研磨剤 COLLECTION',
  'Z0AIu63Nmj8': 'Macroblank ヒーロー v2',
  'xI4u3FSBJSk': 'Macroblank - 絶望に負けた',
};

const videoIds = Object.keys(videoMeta);
// Player State
const player: Ref<typeof YT.Player | any> = ref<YT.Player | null>(null);
const playerReady = ref(false);
const playerState = ref<YT.PlayerState | null>(null);
const videoId = ref(videoIds[0]);
const isLooping = ref(false);
const volume = ref(50);
const savedVolume = ref(50);

// UI State
const isHovered = ref(false);
const currentTime = ref(0);
const duration = ref(0);
let updateInterval: number | null = null;

// Computed: Video name or time
const videoName = computed(() => {
  const format = (t: number) => `${Math.floor(t / 60).toString().padStart(2, '0')}:${Math.floor(t % 60).toString().padStart(2, '0')}`;
  if (isHovered.value && playerReady.value) {
    return `${format(currentTime.value)} / ${format(duration.value)}`;
  }
  return playerReady.value && playerState.value !== YT.PlayerState.PLAYING
    ? '...'
    : videoMeta[videoId.value] ?? '';
});

// --- Core: Init & API ---
const loadYouTubeAPI = (): Promise<typeof YT> => {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
    } else {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
      window.onYouTubeIframeAPIReady = () => resolve(window.YT);
    }
  });
};

const initPlayer = async () => {
  const YT = await loadYouTubeAPI();
  player.value = new YT.Player('tv-iframe', {
    width: screenWidth.toString(),
    height: screenHeight.toString(),
    videoId: videoId.value,
    host: 'https://www.youtube-nocookie.com',
    events: {
      onReady: () => {
        playerReady.value = true;
        setVolume(volume.value);
        player.value!.setPlaybackQuality('small');
      },
      onStateChange: (e: YT.OnStateChangeEvent) => {
        playerState.value = e.data;
        if (e.data === YT.PlayerState.ENDED) {
          isLooping.value ? restartVideo() : playRandomVideo();
        }
      },
    },
    playerVars: {
      rel: 0, modestbranding: 1, controls: 0, showinfo: 0,
      disablekb: 1, fs: 0, iv_load_policy: 3,
      playsinline: 1, origin: window.location.origin
    },
  });
};

// --- Player Controls ---
const playVideo = () => {
  if (!playerReady.value) return;
  const state = player.value!.getPlayerState();
  state === YT.PlayerState.PLAYING
    ? player.value!.pauseVideo()
    : player.value!.playVideo();
};

const restartVideo = () => {
  player.value?.seekTo(0, true);
  player.value?.playVideo();
};

const seekBy = (seconds: number) => {
  const time = player.value?.getCurrentTime() ?? 0;
  player.value?.seekTo(time + seconds, true);
};

const playRandomVideo = () => {
  const others = videoIds.filter(id => id !== videoId.value);
  const next = others[Math.floor(Math.random() * others.length)] ?? videoId.value;
  videoId.value = next;
  player.value?.loadVideoById(next);
};

// --- Volume Handling ---
const setVolume = (v: number) => {
  volume.value = v;
  player.value?.setVolume(v);
};

const fadeOutVolume = (step = 5, ms = 50) => {
  savedVolume.value = volume.value;
  const fade = () => {
    if (volume.value > 0) {
      setVolume(Math.max(0, volume.value - step));
      setTimeout(fade, ms);
    }
  };
  fade();
};

const fadeInVolume = (step = 5, ms = 50) => {
  const fade = () => {
    if (volume.value < savedVolume.value) {
      setVolume(Math.min(savedVolume.value, volume.value + step));
      setTimeout(fade, ms);
    }
  };
  fade();
};

defineExpose({ fadeOutVolume, fadeInVolume });

// --- Hover & Time Updates ---
const updateTime = () => {
  currentTime.value = player.value?.getCurrentTime() ?? 0;
  duration.value = player.value?.getDuration() ?? 0;
};

const onHover = (hovered: boolean) => {
  isHovered.value = hovered;
  if (hovered && playerReady.value) {
    updateTime();
    updateInterval = window.setInterval(updateTime, 500);
  } else if (updateInterval !== null) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
};

// --- Lifecycle ---
onMounted(initPlayer);
</script>
