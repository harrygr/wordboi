const getId = (() => {
  let lastId = 0;

  return function getNextUniqueId() {
    lastId = lastId + 1;
    return `${lastId}`;
  };
})();

export const createEventBus = <EventRegistry>() => {
  const createSubs = <E extends keyof EventRegistry & string>(): Partial<
    Record<E, Record<string, (payload: EventRegistry[E]) => void>>
  > => {
    return {};
  };

  const subscriptions = createSubs();

  const subscribe = <E extends keyof EventRegistry & string>(
    event: E,
    cb: (payload: EventRegistry[E]) => void
  ) => {
    const id = getId();

    if (!subscriptions[event]) {
      subscriptions[event] = {
        [id]: cb,
      } as Record<
        string,
        (payload: EventRegistry[keyof EventRegistry]) => void
      >;
    } else {
      (
        subscriptions[event] as Record<
          string,
          (payload: EventRegistry[E]) => void
        >
      )[id] = cb;
    }

    return () => {
      if (subscriptions[event]) {
        delete subscriptions[event]![id];
      }
    };
  };

  const publish = <E extends keyof EventRegistry & string>(
    event: E,
    payload: EventRegistry[E]
  ) => {
    const cbs = subscriptions[event];
    if (cbs) {
      Object.values(cbs).map((cb) => cb(payload));
    }
  };

  return { subscribe, publish };
};
