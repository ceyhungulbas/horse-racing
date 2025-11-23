<template>
  <div class="app-container">
    <div class="header-section">
      <ControlPanel />
    </div>
    <div class="main-content">
      <div class="sidebar-left">
        <HorseList />
      </div>
      <div class="center-track">
        <RaceTrack />
      </div>
      <div class="sidebar-right">
        <div class="schedule-section">
          <RaceSchedule />
        </div>
        <div class="results-section">
          <RaceResults />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HorseList from "./components/HorseList/index.vue";
import RaceSchedule from "./components/RaceSchedule/index.vue";
import RaceResults from "./components/RaceResults/index.vue";
import RaceTrack from "./components/RaceTrack/index.vue";
import ControlPanel from "./components/ControlPanel/index.vue";

export default {
  name: "App",
  components: {
    HorseList,
    RaceSchedule,
    RaceResults,
    RaceTrack,
    ControlPanel,
  },
};
</script>

<style lang="scss">
#app {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #ecf0f1;
  min-height: 100vh;
  padding: 20px;
}

.app-container {
  margin: 0 auto;
  height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
}

.main-content {
  display: grid;
  grid-template-columns: 300px 1fr 550px;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.sidebar-left,
.sidebar-right {
  display: flex;
  flex-direction: row;
  gap: 20px;
  min-height: 0;
}

.sidebar-right {
  .schedule-section {
    flex: 1;
    min-height: 0;
  }
  .results-section {
    flex: 1;
    min-height: 0;
  }
}

.center-track {
  min-height: 0;
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #bdc3c7;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #95a5a6;
}
</style>
