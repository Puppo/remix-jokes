import { User } from "@prisma/client";
import { Form, Link, LinksFunction, LoaderFunction, Outlet, useLoaderData } from "remix";
import { JokeHeadList } from "~/jokes/models";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import stylesUrl from "../styles/jokes.css";

export const links: LinksFunction = () => {
    return [
        {
            rel: "stylesheet",
            href: stylesUrl
        }
    ];
};

type LoaderData = {
    user: User | null;
    jokeListItems: JokeHeadList;
};

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
    const jokeListItems = await db.joke.findMany({
        take: 5,
        select: { id: true, name: true },
        orderBy: { createdAt: "desc" }
    })
    const validations = await JokeHeadList.safeParseAsync(jokeListItems);

    if (validations.success) {
        const user = await getUser(request);
        const data: LoaderData = {
            jokeListItems,
            user
        };
        return data;
    }
    else {
        throw validations.error;
    }
};

export default function JokesRoute() {
    const { user, jokeListItems } = useLoaderData<LoaderData>();

    return (
        <div className="jokes-layout">
            <header className="jokes-header">
                <div className="container">
                    <h1 className="home-link">
                        <Link
                            to="/"
                            prefetch="intent"
                            title="Remix Jokes"
                            aria-label="Remix Jokes"
                        >
                            <span className="logo">🤪</span>
                            <span className="logo-medium">J🤪KES</span>
                        </Link>
                    </h1>
                    {user ? (
                        <div className="user-info">
                            <span>{`Hi ${user.username}`}</span>
                            <Form action="/logout" method="post">
                                <button type="submit" className="button">
                                    Logout
                                </button>
                            </Form>
                        </div>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            </header>
            <main className="jokes-main">
                <div className="container">
                    <div className="jokes-list">
                        <Link prefetch="intent" to=".">Get a random joke</Link>
                        <p>Here are a few more jokes to check out:</p>
                        <ul>
                            {jokeListItems.map(joke => (
                                <li key={joke.id}>
                                    <Link prefetch="intent" to={joke.id}>{joke.name}</Link>
                                </li>
                            ))}
                        </ul>
                        <Link prefetch="intent" to="new" className="button">
                            Add your own
                        </Link>
                    </div>
                    <div className="jokes-outlet">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}