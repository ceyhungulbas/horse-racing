import { createStore } from "vuex";
import { ROUND_DISTANCES } from "../constants/roundDistances";
import { HORSE_NAMES } from "../constants/horseNames";
import { COLORS } from "../constants/colors";

export default createStore({
  state: {
    horses: [],
    schedule: [],
    results: [],
    currentRoundIndex: 0,
    isRaceRunning: false,
    isRaceFinished: false,
  },
  mutations: {
    SET_HORSES(state, horses) {
      state.horses = horses;
    },
    SET_SCHEDULE(state, schedule) {
      state.schedule = schedule;
    },
    RESET_GAME(state) {
      state.results = [];
      state.currentRoundIndex = 0;
      state.isRaceRunning = false;
      state.isRaceFinished = false;
    },
    ADD_RESULT(state, result) {
      state.results.push(result);
    },
    SET_RACE_RUNNING(state, isRunning) {
      state.isRaceRunning = isRunning;
    },
    INCREMENT_ROUND(state) {
      state.currentRoundIndex++;
    },
    SET_RACE_FINISHED(state, isFinished) {
      state.isRaceFinished = isFinished;
    },
  },
  actions: {
    generateHorses({ commit }) {
      const horses = [];
      const usedNames = new Set();

      for (let i = 0; i < 20; i++) {
        let name;
        do {
          name = HORSE_NAMES[Math.floor(Math.random() * HORSE_NAMES.length)];
        } while (usedNames.has(name));
        usedNames.add(name);

        horses.push({
          id: i + 1,
          name: name,
          color: COLORS[i % COLORS.length],
          condition: Math.floor(Math.random() * 100) + 1,
        });
      }
      commit("SET_HORSES", horses);
    },
    generateSchedule({ commit, state }) {
      const schedule = [];

      ROUND_DISTANCES.forEach((distance, index) => {
        const shuffled = [...state.horses].sort(() => 0.5 - Math.random());
        const selectedHorses = shuffled.slice(0, 10);

        schedule.push({
          id: index + 1,
          distance: distance,
          horses: selectedHorses,
        });
      });

      commit("SET_SCHEDULE", schedule);
      commit("RESET_GAME");
    },
    finishRound({ commit, state }, result) {
      commit("ADD_RESULT", result);
      if (state.currentRoundIndex < 5) {
        commit("INCREMENT_ROUND");
        commit("SET_RACE_RUNNING", false);
      } else {
        commit("SET_RACE_RUNNING", false);
        commit("SET_RACE_FINISHED", true);
      }
    },
  },
  getters: {
    allHorses: (state) => state.horses,
    schedule: (state) => state.schedule,
    results: (state) => state.results,
    currentRound: (state) => state.schedule[state.currentRoundIndex],
    isRaceRunning: (state) => state.isRaceRunning,
    isRaceFinished: (state) => state.isRaceFinished,
    currentRoundIndex: (state) => state.currentRoundIndex,
  },
});
