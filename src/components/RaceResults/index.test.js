import { render } from "@testing-library/vue";
import { describe, it, expect } from "vitest";
import { createStore } from "vuex";
import RaceResults from "./index.vue";

function renderWithResults(resultsArray) {
  const store = createStore({
    getters: {
      results: () => resultsArray,
    },
  });

  return render(RaceResults, {
    global: {
      plugins: [store],
    },
  });
}

describe("RaceResults.vue", () => {
  it("renders the title", () => {
    const { getByText } = renderWithResults([]);
    expect(getByText("Results")).toBeTruthy();
  });

  it("shows empty state when there are no results", () => {
    const { getByText, queryByText } = renderWithResults([]);

    expect(getByText("No races finished yet.")).toBeTruthy();

    expect(queryByText(/Round/i)).toBeNull();
  });

  it("renders round tables when results exist", () => {
    const sample = [
      {
        roundId: 1,
        distance: 1200,
        positions: [
          { id: 1, name: "Thunder" },
          { id: 2, name: "Storm" },
        ],
      },
    ];

    const { getByText, container } = renderWithResults(sample);

    expect(getByText("1st Round - 1200m")).toBeTruthy();

    expect(getByText("Thunder")).toBeTruthy();
    expect(getByText("Storm")).toBeTruthy();

    const positionCells = container.querySelectorAll("tbody td:first-child");
    expect(positionCells.length).toBe(2);
    expect(positionCells[0].textContent).toBe("1");
    expect(positionCells[1].textContent).toBe("2");
  });

  it("renders every round when multiple rounds exist", () => {
    const sample = [
      {
        roundId: 1,
        distance: 1000,
        positions: [{ id: 1, name: "Wind" }],
      },
      {
        roundId: 2,
        distance: 1500,
        positions: [{ id: 2, name: "Flash" }],
      },
    ];

    const { getByText } = renderWithResults(sample);

    expect(getByText("1st Round - 1000m")).toBeTruthy();
    expect(getByText("2st Round - 1500m")).toBeTruthy();
    expect(getByText("Wind")).toBeTruthy();
    expect(getByText("Flash")).toBeTruthy();
  });

  it("shows correct position ordering in each round table", () => {
    const sample = [
      {
        roundId: 3,
        distance: 800,
        positions: [
          { id: 10, name: "Alpha" },
          { id: 11, name: "Bravo" },
          { id: 12, name: "Charlie" },
        ],
      },
    ];

    const { container } = renderWithResults(sample);

    const posValues = Array.from(
      container.querySelectorAll("tbody tr td:first-child")
    ).map((td) => td.textContent.trim());

    expect(posValues).toEqual(["1", "2", "3"]);
  });
});
