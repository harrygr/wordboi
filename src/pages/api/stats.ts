import { NextApiHandler } from "next";
import * as t from "io-ts";
import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import { pushStat } from "../../stathat";

export const StatName = t.union([
  t.literal("wordboi.game_won"),
  t.literal("wordboi.game_lost"),
  t.literal("wordboi.test"),
]);

const StatQuery = t.type({ stat: StatName });

const handler: NextApiHandler = async (req, res) => {
  const result = await pipe(
    req.query,
    StatQuery.decode,
    E.map(({ stat }) => stat),
    TE.fromEither,
    TE.map(pushStat),
    TE.chain(TE.fromTask),
    TE.fold(() => T.of(false), T.of)
  )();

  res.send(result);
};

export default handler;
