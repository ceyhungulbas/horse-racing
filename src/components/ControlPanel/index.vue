<template>
  <div class="control-panel">
    <div class="title">
      <h1>Horse Racing</h1>
    </div>
    <div class="actions">
      <button @click="generateProgram" :disabled="isRaceRunning">Generate Program</button>
      <button @click="startRace" :disabled="!canStart || isRaceRunning" class="start-btn">Start</button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ControlPanel',
  setup() {
    const store = useStore();
    const isRaceRunning = computed(() => store.getters.isRaceRunning);
    const schedule = computed(() => store.getters.schedule);
    const canStart = computed(() => schedule.value.length > 0 && !store.getters.isRaceFinished);

    const generateProgram = () => {
      store.dispatch('generateHorses');
      store.dispatch('generateSchedule');
    };

    const startRace = () => {
      store.dispatch('startRace'); // We will implement this action in store or handle in RaceTrack
      // Actually, the logic for running the race loop might be better placed in the RaceTrack component 
      // or a dedicated action that updates state periodically. 
      // For now, let's assume we trigger a flag in the store.
      store.commit('SET_RACE_RUNNING', true);
    };

    return { generateProgram, startRace, isRaceRunning, canStart };
  }
}
</script>

<style scoped lang="scss">
.control-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #2c3e50;
  color: white;
  border-radius: 8px;
  margin-bottom: 1rem;

  h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  .actions {
    display: flex;
    gap: 1rem;
  }

  button {
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    background: #ecf0f1;
    color: #2c3e50;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: #bdc3c7;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.start-btn {
      background: #27ae60;
      color: white;

      &:hover:not(:disabled) {
        background: #2ecc71;
      }
    }
  }
}
</style>
