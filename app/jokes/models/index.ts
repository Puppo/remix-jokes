import { TypeOf, z } from "zod";

export const JokeHead = z.object({
  id: z.string(),
  name: z.string(),
});
export type JokeHead = TypeOf<typeof JokeHead>;
export const JokeHeadList = z.array(JokeHead);
export type JokeHeadList = TypeOf<typeof JokeHeadList>;

export const Joke = z.intersection(
  JokeHead,
  z.object({
    content: z.string(),
  })
);
export type Joke = TypeOf<typeof Joke>;

export const Jokes = z.array(Joke);
export type Jokes = TypeOf<typeof Jokes>;
