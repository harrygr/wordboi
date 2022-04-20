import { createEventBus } from "./eventBus";

interface EventRegistry {
  game_played: { result: "win" | "loss" };
  thing_happened: undefined;
}

it("subs and pubs for an event", () => {
  const handler = jest.fn();
  const EventBus = createEventBus<EventRegistry>();

  const unsubscribe = EventBus.subscribe("game_played", (payload) =>
    handler(payload)
  );

  // EventBus.subscribe('thing_happened', (thing) => )

  EventBus.publish("game_played", { result: "win" });

  expect(handler).toHaveBeenCalledWith({ result: "win" });

  handler.mockClear();
  unsubscribe();

  EventBus.publish("game_played", { result: "loss" });

  expect(handler).not.toHaveBeenCalled();
});
