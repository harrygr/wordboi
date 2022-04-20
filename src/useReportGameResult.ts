import React from "react";
import { config } from "./config";
import { GameEvents } from "./gameEvents";
import { StatName } from "./statTypes";

const reportStat = (stat: StatName) => {
  fetch(`/api/stats?stat=${stat}`).catch(() => null);
};

export const useReportGameResult = () => {
  React.useEffect(() => {
    const unsubscribe = GameEvents.subscribe("game_played", ({ result }) => {
      reportStat(`wordboi.${config.env}.game_played`);

      if (result === "win") {
        reportStat(`wordboi.${config.env}.game_won`);
      }
      if (result === "loss") {
        reportStat(`wordboi.${config.env}.game_lost`);
      }
    });
    return unsubscribe;
  }, []);
};
