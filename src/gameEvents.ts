import { createEventBus } from "./eventBus";

export const GameEvents = createEventBus<{
  game_played: { gameNumber: number; result: "win" | "loss"; guesses: number };
}>();
