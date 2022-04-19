import axios, { AxiosError } from "axios";
import { config } from "./config";
import * as T from "fp-ts/Task";

const stathatUrl = "http://api.stathat.com/ez";

export const pushStat = (stat: string): T.Task<boolean> => {
  return () =>
    axios
      .get(stathatUrl, { params: { ezkey: config.stathatKey, stat, count: 1 } })
      .then(() => true)
      .catch((_e: AxiosError) => {
        return false;
      });
};
