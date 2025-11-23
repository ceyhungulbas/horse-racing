import { render } from "@testing-library/vue";
import { describe, it, expect, vi } from "vitest";
import { createStore } from "vuex";
import RaceTrack from "./index.vue";

vi.stubGlobal("requestAnimationFrame", (cb) => setTimeout(() => cb(1000), 0));
vi.stubGlobal("cancelAnimationFrame", vi.fn());
vi.stubGlobal("performance", { now: () => 0 });

function createStoreWithRound(options = {}) {
  const currentRound = options.round || null;

  const store = createStore({
    getters: {
      currentRound: () => currentRound,
      isRaceRunning: () => options.isRaceRunning || false,
    },
    actions: {
      finishRound: vi.fn(),
    },
  });

  return store;
}

vi.stubGlobal("requestAnimationFrame", (cb) => cb(1000));
vi.stubGlobal("cancelAnimationFrame", vi.fn());

describe("RaceTrack.vue", () => {
  it("shows 'Waiting for Schedule...' when currentRound is missing", () => {
    const store = createStoreWithRound({ round: null });

    const { getByText } = render(RaceTrack, {
      global: { plugins: [store] },
    });

    expect(getByText("Waiting for Schedule...")).toBeTruthy();
    expect(getByText("Please generate a program to start.")).toBeTruthy();
  });

  it("renders the correct header when currentRound exists", () => {
    const round = {
      id: 1,
      distance: 1200,
      horses: [
        { id: 10, condition: 70 },
        { id: 11, condition: 55 },
      ],
    };

    const store = createStoreWithRound({ round });

    const { getByText } = render(RaceTrack, {
      global: { plugins: [store] },
    });

    expect(getByText("1st Round - 1200m")).toBeTruthy();
  });

  it("renders the correct number of lane numbers", () => {
    const round = {
      id: 1,
      distance: 1200,
      horses: [
        { id: 10, condition: 70 },
        { id: 11, condition: 55 },
      ],
    };

    const store = createStoreWithRound({ round });

    const { container } = render(RaceTrack, {
      global: { plugins: [store] },
    });

    const laneNums = container.querySelectorAll(".lane-num");
    expect(laneNums.length).toBe(2);
    expect(laneNums[0].textContent.trim()).toBe("1");
    expect(laneNums[1].textContent.trim()).toBe("2");
  });

  it("renders horse-runner elements", () => {
    const round = {
      id: 1,
      distance: 1200,
      horses: [
        { id: 10, condition: 70 },
        { id: 11, condition: 55 },
      ],
    };

    const store = createStoreWithRound({ round });

    const { container } = render(RaceTrack, {
      global: { plugins: [store] },
    });

    const runners = container.querySelectorAll(".horse-runner");
    expect(runners.length).toBe(2);
  });

  it("applies 'left 0.5s' transition when race has not started", () => {
    const round = {
      id: 1,
      distance: 1200,
      horses: [{ id: 10, condition: 70 }],
    };

    const store = createStoreWithRound({ round, isRaceRunning: false });

    const { container } = render(RaceTrack, {
      global: { plugins: [store] },
    });

    const runner = container.querySelector(".horse-runner");
    expect(runner.style.transition).toContain("left 0.5s ease");
  });

  it("applies 'none' transition when the race has started", () => {
    const round = {
      id: 1,
      distance: 1200,
      horses: [{ id: 10, condition: 70 }],
    };

    const store = createStoreWithRound({ round, isRaceRunning: true });

    const { container } = render(RaceTrack, {
      global: { plugins: [store] },
    });

    const runner = container.querySelector(".horse-runner");
    expect(runner.style.transition).toBe("none");
  });
});
