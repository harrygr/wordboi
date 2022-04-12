import { NextApiHandler } from "next";
import * as t from "io-ts";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { validWords } from "../../validWords";

const CheckWordQuery = t.type({ word: t.string });
const handler: NextApiHandler = (req, res) => {
  pipe(
    req.query,
    CheckWordQuery.decode,
    E.mapLeft(() => "Invalid query"),
    E.fold(
      (error) => res.status(400).json({ error }),
      ({ word }) => res.json({ word, isValid: validWords.includes(word) })
    )
  );
};

export default handler;
