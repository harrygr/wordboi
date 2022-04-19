import { config } from "./config";
import * as t from "io-ts";

export const StatName = t.union([
  t.literal(`wordboi.${config.env}.game_played`),
  t.literal(`wordboi.${config.env}.game_won`),
  t.literal(`wordboi.${config.env}.game_lost`),
]);

export type StatName = t.TypeOf<typeof StatName>;
