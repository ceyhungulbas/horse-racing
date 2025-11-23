import { render, fireEvent } from "@testing-library/vue";
import { createStore } from "vuex";
import ControlPanel from "./index.vue";

const createVuexStore = ({
  isRaceRunning = false,
  isRaceFinished = false,
  scheduleLength = 0,
} = {}) => {
  const actions = {
    generateHorses: vi.fn(),
    generateSchedule: vi.fn(),
    startRace: vi.fn(),
  };
  const mutations = { SET_RACE_RUNNING: vi.fn() };
  const store = createStore({
    state: () => ({
      isRaceRunning,
      isRaceFinished,
      schedule: Array.from({ length: scheduleLength }, (_, i) => ({
        id: i + 1,
      })),
    }),
    getters: {
      isRaceRunning: (state) => state.isRaceRunning,
      isRaceFinished: (state) => state.isRaceFinished,
      schedule: (state) => state.schedule,
    },
    actions,
    mutations,
  });
  return { store, actions, mutations };
};
const renderControlPanel = (options) => {
  const { store, actions, mutations } = createVuexStore(options);
  const utils = render(ControlPanel, { global: { plugins: [store] } });
  return { ...utils, actions, mutations };
};
describe("ControlPanel.vue", () => {
  it("renders the title", () => {
    const { getByText } = renderControlPanel();
    expect(getByText("Horse Racing")).toBeTruthy();
  });

  it("disables the Start button when there is no schedule", () => {
    const { getByRole } = renderControlPanel({ scheduleLength: 0 });

    const startButton = getByRole("button", { name: /start/i });

    expect(startButton.disabled).toBe(true);
  });

  it("enables the Start button when schedule exists and race is not running", () => {
    const { getByRole } = renderControlPanel({
      scheduleLength: 1,
      isRaceRunning: false,
      isRaceFinished: false,
    });

    const startButton = getByRole("button", { name: /start/i });
    expect(startButton.disabled).toBe(false);
  });

  it('dispatches generateHorses and generateSchedule when "Generate Program" is clicked', async () => {
    const { getByRole, actions } = renderControlPanel();

    const btn = getByRole("button", { name: /generate program/i });
    await fireEvent.click(btn);

    expect(actions.generateHorses).toHaveBeenCalledTimes(1);
    expect(actions.generateSchedule).toHaveBeenCalledTimes(1);
  });

  it('dispatches startRace and commits SET_RACE_RUNNING when "Start" is clicked', async () => {
    const { getByRole, actions, mutations } = renderControlPanel({
      scheduleLength: 1,
    });

    const startBtn = getByRole("button", { name: /start/i });
    await fireEvent.click(startBtn);

    expect(actions.startRace).toHaveBeenCalledTimes(1);

    const firstCall = mutations.SET_RACE_RUNNING.mock.calls[0];
    expect(firstCall[1]).toBe(true);
  });

  it("disables both buttons when the race is running", () => {
    const { getByRole } = renderControlPanel({
      scheduleLength: 1,
      isRaceRunning: true,
    });

    const genBtn = getByRole("button", { name: /generate program/i });
    const startBtn = getByRole("button", { name: /start/i });

    expect(genBtn.disabled).toBe(true);
    expect(startBtn.disabled).toBe(true);
  });
});
