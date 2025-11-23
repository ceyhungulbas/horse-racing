<template>
  <div class="race-track-container">
    <div class="track-header">
      <h2 v-if="currentRound">
        {{ currentRound.id }}st Round - {{ currentRound.distance }}m
      </h2>
      <h2 v-else>Waiting for Schedule...</h2>
    </div>

    <div class="track-wrapper" v-if="currentRound">
      <div class="lane-numbers">
        <div
          v-for="(horse, index) in currentRound.horses"
          :key="horse.id"
          class="lane-num"
        >
          {{ index + 1 }}
        </div>
      </div>

      <div class="track-lanes">
        <div
          v-for="(horse, index) in currentRound.horses"
          :key="horse.id"
          class="lane"
        >
          <div
            class="horse-runner"
            :style="{
              left: horsePositions[horse.id] + '%',
              transition: isRaceRunning ? 'none' : 'left 0.5s ease',
            }"
          >
            <img class="horse-icon" src="../../assets/horse.png" />
          </div>
        </div>

        <div class="finish-line"></div>
      </div>
    </div>

    <div v-else class="track-placeholder">
      <p>Please generate a program to start.</p>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch, onUnmounted } from "vue";
import { useStore } from "vuex";

export default {
  name: "RaceTrack",
  setup() {
    const store = useStore();
    const currentRound = computed(() => store.getters.currentRound);
    const isRaceRunning = computed(() => store.getters.isRaceRunning);

    const horsePositions = ref({});
    const horseSpeeds = ref({});
    const finishedHorses = ref([]);
    let animationFrameId = null;

    // Initialize positions when round changes
    watch(
      currentRound,
      (newRound) => {
        if (newRound) {
          const positions = {};
          newRound.horses.forEach((h) => (positions[h.id] = 0));
          horsePositions.value = positions;
          finishedHorses.value = [];
        }
      },
      { immediate: true }
    );

    // Start/Stop race loop
    watch(isRaceRunning, (isRunning) => {
      if (isRunning) {
        startRaceLoop();
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    });

    const startRaceLoop = () => {
      // Calculate initial speeds based on condition
      // Speed factor: Condition (1-100) affects base speed.
      // We need to cover 100% distance.
      // Distance is in meters (e.g. 1200).
      // Let's say 100% = 90vw (visual width).
      // We update % progress.

      // Initialize speeds if starting fresh
      if (finishedHorses.value.length === 0) {
        currentRound.value.horses.forEach((h) => {
          // Random factor + Condition factor
          // Higher condition = slightly faster
          // Base speed to ensure race finishes in reasonable time (e.g. 5-10 seconds)
          // 60fps.
          horseSpeeds.value[h.id] = 0.05 + h.condition * 0.0005;
        });
      }

      let lastTime = performance.now();

      const loop = (time) => {
        const delta = time - lastTime;
        lastTime = time;

        let allFinished = true;
        const roundDistance = currentRound.value.distance;

        currentRound.value.horses.forEach((h) => {
          if (horsePositions.value[h.id] < 90) {
            // 90% is the finish line visually
            allFinished = false;

            // Update speed with some randomness per frame to simulate variable pace
            // But keep it tied to condition so better condition wins more often
            const randomFlux = (Math.random() - 0.5) * 0.02;
            let currentSpeed = horseSpeeds.value[h.id] + randomFlux;
            if (currentSpeed < 0.01) currentSpeed = 0.01;

            // Adjust for distance: longer distance = slower progress per frame visually if we want constant time,
            // OR constant speed means longer time. Let's go with constant speed logic.
            // But visual track is fixed width. So 1200m vs 2200m.
            // Speed should be relative to track width.
            // Real logic: Speed (m/s) / Distance (m) * 100 = %/s
            // Let's assume base speed is roughly constant in m/s.
            // So step = (Speed / Distance) * factor

            const step = ((currentSpeed * 1000) / roundDistance) * (delta / 16); // Normalize to ~60fps

            horsePositions.value[h.id] += step;

            if (horsePositions.value[h.id] >= 90) {
              horsePositions.value[h.id] = 90;
              if (!finishedHorses.value.find((fh) => fh.id === h.id)) {
                finishedHorses.value.push(h);
              }
            }
          }
        });

        if (finishedHorses.value.length === currentRound.value.horses.length) {
          // Race finished
          store.dispatch("finishRound", {
            roundId: currentRound.value.id,
            distance: currentRound.value.distance,
            positions: [...finishedHorses.value],
          });
        } else {
          animationFrameId = requestAnimationFrame(loop);
        }
      };

      animationFrameId = requestAnimationFrame(loop);
    };

    onUnmounted(() => {
      cancelAnimationFrame(animationFrameId);
    });

    return { currentRound, horsePositions, isRaceRunning };
  },
};
</script>

<style scoped lang="scss">
.track-wrapper {
  display: flex;
  height: 100%;
  position: relative;
}

.lane-numbers {
  width: 40px;
  background: #2f4f2f;
  color: white;

  .lane-num {
    height: 40px;
    line-height: 40px;
    width: 40px;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.3);

    writing-mode: sideways-lr !important;
    transform: rotate(0deg) !important;
  }
}

.track-lanes {
  flex: 1;
  background: #eee;
  position: relative;
}

.lane {
  height: calc(100% / 10);
  position: relative;
  border-bottom: 1px dashed #bbb;

  &:last-child {
    border-bottom: none;
  }
}

.horse-runner {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.horse-icon {
  width: 40px;
}

.finish-line {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 10%;
  width: 4px;
  background: #c52b2b;

  &::after {
    content: "FINISH";
    position: absolute;
    top: -20px;
    right: -10px;
    font-size: 12px;
    color: #c52b2b;
    font-weight: 700;
  }
}
</style>
