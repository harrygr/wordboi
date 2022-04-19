import * as React from "react";
import { GameAction } from "../GameActions";
import { isNil } from "../utils";

interface Props {
  message: string | null;
  dispatch: React.Dispatch<GameAction>;
}

export const ErrorMessage: React.FC<Props> = ({ message, dispatch }) => {
  const clearMessage = React.useCallback(
    () => dispatch({ type: "SetError", message: null }),
    [dispatch]
  );
  React.useEffect(() => {
    if (!isNil(message)) {
      const timer = window.setTimeout(() => {
        clearMessage();
      }, 3000);

      return () => window.clearTimeout(timer);
    }
  }, [message, clearMessage]);

  return message ? (
    <div
      onClick={clearMessage}
      className="text-red-600 text-lg  text-center absolute left-1/2 -translate-x-1/2 top-20 bg-gray-200 py-6 px-8 rounded bg-opacity-20 firefox:bg-opacity-90 firefox:bg-gray-100 backdrop-filter backdrop-blur shadow-lg"
    >
      {message}
    </div>
  ) : null;
};
