<template>
  <Background :isTimerActive="isTimerActive" :isOnBreak="isOnBreak" />
  <TopBar />
  <ShootingStars />
  <div class=foregroud>
    <div class="status-wrapper">
      <Transition name="fade">
        <p v-if="isTimerActive" class="status">
          {{ isOnBreak ? 'take a break' : 'focus' }}
        </p>
      </Transition>
    </div>
    <Transition name="fade">
      <p class="timer">
        {{ isTimerActive ? `${timeDisplay.sign}${timeDisplay.minutes}:${timeDisplay.seconds}` :
          'click the planet' }}
      </p>
    </Transition>
    <WrappedPlanet @planet-clicked="onPlanetClicked" />
  </div>
  <YoutubeEmbedTV ref="TV" />
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import TopBar from './components/TopBar.vue';
import ShootingStars from './components/ShootingStars.vue';
import YoutubeEmbedTV from './components/YoutubeEmbedTV.vue';
import Background from './components/Background.vue';
import WrappedPlanet from './components/WrappedPlanet.vue';

const WORKTIME_MINUTES: number = 25;
const BREAKTIME_MINUTES: number = 5;
const tvRef = useTemplateRef<typeof YoutubeEmbedTV>('TV');

const remainingSeconds = ref(0);
const isTimerActive = ref(false);

const timeDisplay = computed(() => {
  const abs = Math.abs(remainingSeconds.value);
  const sign = remainingSeconds.value < 0 ? '-' : '';
  const minutes = Math.floor(abs / 60);
  const seconds = abs % 60;
  return {
    sign,
    minutes,
    seconds: seconds.toString().padStart(2, '0')
  };
});

let interval: number | undefined;
let isOnBreak = ref(false);

const onPlanetClicked = () => {
  stopSound();
  if (!isTimerActive.value) {
    startTimer(WORKTIME_MINUTES * 60);
  } else {
    resetTimer();
    if (isOnBreak.value) {
      isOnBreak.value = false;
    } else {
      isOnBreak.value = true;
      startTimer(BREAKTIME_MINUTES * 60);
    }
  }
};

const resetTimer = () => {
  remainingSeconds.value = 0;
  clearInterval(interval);
  isTimerActive.value = false;
};

const startTimer = (seconds: number) => {
  if (!isTimerActive.value) {
    remainingSeconds.value = seconds;
    isTimerActive.value = true;

    interval = setInterval(() => {
      remainingSeconds.value--;
      if (remainingSeconds.value === 0) {
        onTimerEnd();
      }

    }, 1000);
  }
};

const onTimerEnd = () => {
  tvRef.value?.fadeOutVolume(15,300);
  playSound(2000);
};
const notificationSound = ref<HTMLAudioElement | null>(null);

const playSound = (delayMs = 0) => {
  setTimeout(() => {
    const audio = new Audio('/sounds/notify.ogg');
    audio.loop = true;
    audio.play().catch((error) => {
      console.error('Error playing sound:', error);
    });
    notificationSound.value = audio;
  }, delayMs);
};

const stopSound = () => {
  if (notificationSound.value) {
    notificationSound.value.pause();
    notificationSound.value.currentTime = 0;
    notificationSound.value = null;
    tvRef.value?.fadeInVolume(15, 100);
  }
};
</script>



<style scoped>
.foregroud {
  height: 100vh;
  z-index: 10;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-content: start;
  justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.status {
  width: 100%;
  top: 10%;
  text-align: center;
  color: white;
  z-index: 1000;
}

.status-wrapper {
  height: 10%;
  display: flex;
  justify-content: center;
}

.timer{
  position: relative;
  top: 5%;
}

</style>
