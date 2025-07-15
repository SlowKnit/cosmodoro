<template>
  <div ref="spriteEl" class="sprite-sheet-player" />
</template>

<script setup lang="ts">
import { Console } from 'console'
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

interface Props {
  spriteUrl: string
  frameWidth: number
  frameHeight: number
  frameCount: number
  fps: number
  loop: boolean
  columns: number
}

const props = defineProps<Props>()

const spriteEl = ref<HTMLElement | null>(null)
let frameIndex = 0
let lastTime = 0
let rafId: number | null = null
let frameDuration = 1000 / props.fps

function setBackgroundPosition(index: number) {
  const col = index % props.columns
  const row = Math.floor(index / props.columns)
  const x = -col * props.frameWidth
  const y = -row * props.frameHeight
  spriteEl.value!.style.backgroundPosition = `${x}px ${y}px`
}

function animate(time: number) {
  if (time - lastTime >= frameDuration) {
    lastTime = time
    frameIndex++

    if (frameIndex >= props.frameCount) {
      if (props.loop) {
        frameIndex = 0
      } else {
        stop()
        return
      }
    }

    setBackgroundPosition(frameIndex)
  }

  rafId = requestAnimationFrame(animate)
}

function start() {
  stop()
  frameIndex = 0
  lastTime = performance.now()
  setBackgroundPosition(frameIndex)
  rafId = requestAnimationFrame(animate)
}

function stop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

onMounted(() => {
  const el = spriteEl.value!
  el.style.width = `${props.frameWidth}px`
  el.style.height = `${props.frameHeight}px`
  el.style.backgroundImage = `url(${props.spriteUrl})`
  console.log(el.style.backgroundImage);
  el.style.backgroundRepeat = 'no-repeat'
  start()
})

onBeforeUnmount(stop)
</script>

<style scoped>
.sprite-sheet-player {
  image-rendering: pixelated;
  display: block;
  overflow: hidden;
  will-change: background-position;
  transform: scale(3);
}
</style>
