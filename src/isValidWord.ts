import * as t from "io-ts";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import { identity, pipe } from "fp-ts/lib/function";

const checkWordResponse = t.type({
  isValid: t.boolean,
});

export const isValidWord = (word: string) => {
  return pipe(
    TE.tryCatch<any, unknown>(
      () => fetch(`/api/checkWord?word=${word}`).then((res) => res.json()),
      () => "failed to check word"
    ),
    TE.chainEitherK(checkWordResponse.decode),
    TE.fold(
      () => T.of(false),
      ({ isValid }) => T.of(isValid)
    )
  );
};
