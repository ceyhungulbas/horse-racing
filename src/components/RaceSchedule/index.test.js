import { render } from "@testing-library/vue";
import { describe, it, expect } from "vitest";
import { createStore } from "vuex";
import RaceSchedule from "./index.vue";

function renderWithSchedule(scheduleArray) {
  const store = createStore({
    getters: {
      schedule: () => scheduleArray,
      currentRoundIndex: () => 0,
    },
  });

  return render(RaceSchedule, {
    global: { plugins: [store] },
  });
}

describe("RaceSchedule.vue", () => {
  it("renders title", () => {
    const { getByText } = renderWithSchedule([]);
    expect(getByText("Program")).toBeTruthy();
  });

  it("shows empty state when schedule is empty", () => {
    const { getByText, queryByText } = renderWithSchedule([]);

    expect(getByText("Schedule not generated.")).toBeTruthy();

    expect(queryByText(/Round/i)).toBeNull();
  });

  it("renders round table when schedule exists", () => {
    const sample = [
      {
        id: 1,
        distance: 1200,
        horses: [
          { id: 1, name: "Thunder" },
          { id: 2, name: "Storm" },
        ],
      },
    ];

    const { getByText, container } = renderWithSchedule(sample);

    expect(getByText("1st Round - 1200m")).toBeTruthy();

    expect(getByText("Thunder")).toBeTruthy();
    expect(getByText("Storm")).toBeTruthy();

    const posCells = container.querySelectorAll("tbody td:first-child");
    expect(posCells.length).toBe(2);
    expect(posCells[0].textContent.trim()).toBe("1");
    expect(posCells[1].textContent.trim()).toBe("2");
  });

  it("renders multiple rounds correctly", () => {
    const sample = [
      {
        id: 1,
        distance: 1000,
        horses: [{ id: 10, name: "Wind" }],
      },
      {
        id: 2,
        distance: 1500,
        horses: [{ id: 20, name: "Flash" }],
      },
    ];

    const { getByText } = renderWithSchedule(sample);

    expect(getByText("1st Round - 1000m")).toBeTruthy();
    expect(getByText("2st Round - 1500m")).toBeTruthy();

    expect(getByText("Wind")).toBeTruthy();
    expect(getByText("Flash")).toBeTruthy();
  });

  it("position numbers should increment correctly per round", () => {
    const sample = [
      {
        id: 3,
        distance: 800,
        horses: [
          { id: 10, name: "Alpha" },
          { id: 11, name: "Bravo" },
          { id: 12, name: "Charlie" },
        ],
      },
    ];

    const { container } = renderWithSchedule(sample);

    const posValues = Array.from(
      container.querySelectorAll("tbody tr td:first-child")
    ).map((td) => td.textContent.trim());

    expect(posValues).toEqual(["1", "2", "3"]);
  });
});
