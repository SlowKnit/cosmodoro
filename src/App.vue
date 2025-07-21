<template>
  <Background :isTimerActive='isTimerActive' :isOnBreak='isOnBreak' />
  <TopBar />
  <ShootingStars />
  <SideBar :break-minutes="breaktime_mins" :focus-minutes="focustime_mins"
    @update:focus-minutes="(newValue) => { focustime_mins = newValue }"
    @update:break-minutes="(newValue) => { breaktime_mins = newValue }" />
  <div class='foregroud'>
    <div class='status-wrapper'>
      <Transition name='fade'>
        <p v-if='isTimerActive' class='status'>
          {{ isOnBreak ? 'take a break' : 'focus' }}
        </p>
      </Transition>
    </div>
    <Transition name='fade'>
      <p class='timer' :class="{ toggle: isTimerActive }" @click="timerPauseToggle">
        {{ isPaused ? 'paused' :
          isTimerActive ? `${timeDisplay.sign}${timeDisplay.minutes}:${timeDisplay.seconds}` :
            'click the planet' }}
      </p>
    </Transition>
    <WrappedPlanet @planet-clicked='onPlanetClicked' />
  </div>
  <YoutubeEmbedTV v-if="!isMobile" ref='TV' />
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import TopBar from './components/TopBar.vue';
import ShootingStars from './components/ShootingStars.vue';
import YoutubeEmbedTV from './components/YoutubeEmbedTV.vue';
import Background from './components/Background.vue';
import WrappedPlanet from './components/WrappedPlanet.vue';
import SideBar from './components/SideBar.vue';

const isMobile = ref(false);
const focustime_mins = ref(25);
const breaktime_mins = ref(5);

const isPaused = ref(false);
const remainingSeconds = ref(0);
const isTimerActive = ref(false);

const tvRef = useTemplateRef<typeof YoutubeEmbedTV>('TV');
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
    startTimer(focustime_mins.value * 60);
  } else {
    resetTimer();
    if (isOnBreak.value) {
      isOnBreak.value = false;
    } else {
      isOnBreak.value = true;
      startTimer(breaktime_mins.value * 60);
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

const timerPauseToggle = () => {
  if (!isTimerActive.value) return;

  if (isPaused.value) {
    // Resume
    isPaused.value = false;
    interval = setInterval(() => {
      remainingSeconds.value--;
      if (remainingSeconds.value === 0) {
        onTimerEnd();
      }
    }, 1000);
  } else {
    // Pause
    isPaused.value = true;
    clearInterval(interval);
  }
};

const onTimerEnd = () => {
  tvRef.value?.fadeOutVolume(15, 300);
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

onMounted(() => {
  isMobile.value = window.innerWidth <= 768;
});
</script>



<style scoped>
.foregroud {
  height: 100vh;
  width: 70%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-content: center;
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
  position: absolute;
  justify-self: center;
  text-align: end;
  color: white;
  z-index: 1000;
}

.status-wrapper {
  height: 15%;
  margin-top: 10%;
}

.timer {
  transition: filter 500ms, transform 300ms;
  font-size: clamp(2rem, 5vw, 80px);
  padding: 10%;
}

.toggle:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 0 .15rem cyan);
}
</style>
