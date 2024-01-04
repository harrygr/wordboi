import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GameStateProvider, useGameState } from "./GameState";
import { fireEvent, render, screen } from "@testing-library/react";

describe("GameState", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("gets the game number for the current day and refreshes it when the app is refocused", () => {
    vi.setSystemTime(new Date(2023, 10, 10, 13));

    const Component = () => {
      const [state] = useGameState();

      return <div>{state.gameNumber}</div>;
    };

    render(
      <GameStateProvider>
        <Component />
      </GameStateProvider>
    );
    expect(screen.getByText("588")).toBeDefined();

    // simulate the day changing and the app being refocused
    vi.setSystemTime(new Date(2023, 10, 11, 13));
    fireEvent(document, new Event("visibilitychange"));

    expect(screen.getByText("589")).toBeDefined();
  });
});
