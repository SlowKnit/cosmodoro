<template>
  <TopBar />
  <ShootingStars />
  <Background :isTimerActive="isTimerActive" :isOnBreak="isOnBreak" />
  <YoutubeEmbedTV :videoId="ylangyalgnId" :width="560" :height="315" />
  <div class=foregroud>
    <div class="status-wrapper">
      <Transition name="fade">
        <p v-if="isTimerActive" class="status">
          {{ isOnBreak ? 'break time' : 'focus' }}
        </p>
      </Transition>
    </div>
    <Transition name="fade">
      <p class="timer">
        {{ isTimerActive ? `${timeMinutes}:${timeSeconds < 10 ? '0' + timeSeconds : timeSeconds}` : 'click the planet'
        }} </p>
    </Transition>
    <WrappedPlanet @planet-clicked="onPlanetClicked" />
  </div>

</template>

<script setup lang="ts">
import { readonly, ref } from 'vue';
import TopBar from './components/TopBar.vue';
import ShootingStars from './components/ShootingStars.vue';
import YoutubeEmbedTV from './components/YoutubeEmbedTV.vue';
import Background from './components/Background.vue';
import WrappedPlanet from './components/WrappedPlanet.vue';

const WORKTIME_MINUTES: number = 25;
const BREAKTIME_MINUTES: number = 5;

const ylangyalgnId = "pfU0QORkRpY";
const verityId = "0aPosoat6Sg";
const timeMinutes = ref(0);
const timeSeconds = ref(0);
const isTimerActive = ref(false);
let interval: number | undefined = undefined;
let isOnBreak = ref(false);

const onPlanetClicked = () => {
  if (!isTimerActive.value) {
    startTimer(WORKTIME_MINUTES);
  }
  else {
    resetTimer();
    if (isOnBreak.value) {
      isOnBreak.value = false;
    }
    else {
      isOnBreak.value = true;
      startTimer(BREAKTIME_MINUTES);
    }
  }
};

const resetTimer = () => {
  timeMinutes.value = 0;
  timeSeconds.value = 0;
  clearInterval(interval);
  isTimerActive.value = false;
}

const startTimer = (minutes: number) => {
  if (!isTimerActive.value) {
    isTimerActive.value = true;
    timeMinutes.value = minutes;
    timeSeconds.value = 0;
    interval = setInterval(() => {
      if (timeSeconds.value > 0) {
        timeSeconds.value--;
      } else if (timeMinutes.value > 0) {
        timeMinutes.value--;
        timeSeconds.value = 59;
      } else {
        clearInterval(interval);
        if (isOnBreak.value) {
          isOnBreak.value = false;
          isTimerActive.value = false;
          return;
        }
        onPlanetClicked();
      }
    }, 1000);
  }
};
</script>



<style scoped>
.foregroud {
  position: relative;
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
  text-align: center;
  color: white;
  z-index: 1000;
}

.status-wrapper {
  height: 15%;
}
</style>
