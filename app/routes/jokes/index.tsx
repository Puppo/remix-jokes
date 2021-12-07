import { Link, LoaderFunction, useCatch, useLoaderData } from "remix";
import { Joke } from "~/jokes/models";
import { db } from "~/utils/db.server";

type LoaderData = { randomJoke: Joke };

export const loader: LoaderFunction = async () => {
    const count = await db.joke.count();
    const randomRowNumber = Math.floor(Math.random() * count);
    const [randomJoke] = await db.joke.findMany({
        take: 1,
        skip: randomRowNumber
    });
    if (!randomJoke) {
        throw new Response("No random joke found", {
            status: 404
        });
    }


    const validations = await Joke.safeParseAsync(randomJoke);
    if (validations.success) {
        const data: LoaderData = { randomJoke: validations.data };
        return data;
    }
    throw validations.error
};


export default function JokesIndexRoute() {
    const { randomJoke } = useLoaderData<LoaderData>();

    return (
        <div>
            <p>Here's a random joke:</p>
            <p>{randomJoke.content}</p>
            <Link to={randomJoke.id}>
                "{randomJoke.name}" Permalink
            </Link>
        </div>
    );
}

export function CatchBoundary() {
    const caught = useCatch();

    if (caught.status === 404) {
        return (
            <div className="error-container">
                There are no jokes to display.
            </div>
        );
    }
    throw new Error(
        `Unexpected caught response with status: ${caught.status}`
    );
}

export function ErrorBoundary() {
    return (
        <div className="error-container">
            I did a whoopsies.
        </div>
    );
}