<script setup lang="ts">
import { readonly, ref } from 'vue';
import SpritesheetPlayer from './components/SpritesheetPlayer.vue';
import TopBar from './components/TopBar.vue';
import ShootingStars from './components/ShootingStars.vue';
import backgroundImage from '@/assets/Space Background1.png';
import planetImage from '@/assets/planet.png';
import YoutubeEmbed from './components/YoutubeEmbed.vue';

const WORKTIME_MINUTES: number = 25;
const BREAKTIME_MINUTES: number = 5;

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

<template>
  <TopBar />
  <ShootingStars />
  <div :class="{
    background: true,
    break: isTimerActive && isOnBreak,
    focus: isTimerActive && !isOnBreak
  }" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <Transition name="fade">
      <p v-if="isTimerActive" class="status" :key="isOnBreak ? 'break' : 'focus'">
        {{ isOnBreak ? 'break time' : 'focus' }}
      </p>
    </Transition>
    <Transition name="fade">
      <p>
        {{ isTimerActive ? `${timeMinutes}:${timeSeconds < 10 ? '0' + timeSeconds : timeSeconds}`
          : 'click the planet to start' }} </p>
    </Transition>
    <div class="wrapper">
      <YoutubeEmbed class="tv" videoId="0aPosoat6Sg" :width="560" :height="315" />
      <SpritesheetPlayer :columns="120" :fps="60" :frame-count="1200" :loop="true" :frame-height="100"
        :frame-width="100" :sprite-url="planetImage" class="planet" @click="onPlanetClicked" />
    </div>
  </div>
</template>

<style scoped>

.tv{
  position: absolute;
  top: 70%;
  right: 0;
  transform: translate(-50%, -50%);
  filter: drop-shadow(0 0 .5rem violet);
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

.planet {
  transition: filter 500ms, transform 1000ms;
  z-index: 10;
}

.planet:hover {
  filter: drop-shadow(0 0 .5rem violet);
  transform: scale(3.1);
}

.planet:active {
  filter: drop-shadow(0 0 .75rem violet);
  transform: scale(3.2);
  transition: scale 10ms;
}

.status {
  position: fixed;
  top: 20px;
  left: 0;
  width: 100%;
  text-align: center;
  color: white;
  z-index: 1000;
}

.todo {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  transition: filter 1000ms;
}

.background {
  transition: filter 1500ms;
}

.background.focus {
  filter: hue-rotate(-40deg);
}

.background.break {
  filter: hue-rotate(-100deg);
}
</style>
