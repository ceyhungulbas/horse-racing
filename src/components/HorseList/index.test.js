import { render } from "@testing-library/vue";
import { describe, it, expect, vi } from "vitest";
import { createStore } from "vuex";
import HorseList from "./index.vue";

function renderWithHorses(horsesArray) {
  const getters = {
    allHorses: () => horsesArray,
  };

  const store = createStore({
    getters,
  });

  return render(HorseList, {
    global: {
      plugins: [store],
    },
  });
}

describe("HorseList.vue", () => {
  it("renders the title", () => {
    const { getByText } = renderWithHorses([]);
    expect(getByText("Horse List (1-20)")).toBeTruthy();
  });

  it('shows "No horses generated yet." when the list is empty', () => {
    const { getByText, queryByText } = renderWithHorses([]);

    expect(getByText("No horses generated yet.")).toBeTruthy();
    expect(queryByText("Name")).toBeTruthy();
  });

  it("renders the correct number of rows when the list has items", () => {
    const sample = [
      { id: 1, name: "Thunder", condition: "Good", color: "#ff0000" },
      { id: 2, name: "Storm", condition: "Bad", color: "#00ff00" },
    ];

    const { getByText, getAllByRole } = renderWithHorses(sample);

    const rows = getAllByRole("row");
    expect(rows.length).toBe(3);

    expect(getByText("Thunder")).toBeTruthy();
    expect(getByText("Storm")).toBeTruthy();
    expect(getByText("Good")).toBeTruthy();
    expect(getByText("Bad")).toBeTruthy();
  });

  it("applies the correct backgroundColor style for the color-box span", () => {
    const sample = [
      { id: 1, name: "Thunder", condition: "Good", color: "#123abc" },
    ];

    const { container } = renderWithHorses(sample);

    const colorBox = container.querySelector(".color-box");

    expect(colorBox).not.toBeNull();
    expect(colorBox.style.backgroundColor).toBe("rgb(18, 58, 188)");
  });

  it("does not render any color-box elements when the list is empty", () => {
    const { container } = renderWithHorses([]);

    const colorBoxes = container.querySelectorAll(".color-box");
    expect(colorBoxes.length).toBe(0);
  });
});
