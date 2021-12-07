import * as React from "react";
import { MetaFunction, LoaderFunction, useFetcher } from "remix";
import { useLoaderData, json, Link } from "remix";
import pokemon, { Pokemon } from "../../lib/pokemon";

type IndexData = {
  resources: Array<{ name: string; url: string }>;
  demos: Array<{ name: string; to: string }>;
};

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = () => {
  return pokemon;
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "Pokemon Stuff",
    description: "Another pokemon site built with remix",
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  let data = useLoaderData<Pokemon[]>();
  const pokemon = useFetcher<Pokemon[]>();
  const pokemonList = React.useMemo(
    () => pokemon.data || data,
    [data, pokemon]
  );

  return (
    <div className="flex flex-col">
      <pokemon.Form
        method="get"
        className="md:container md:mx-auto"
        action="/pokemon-search"
      >
        <input
          type="text"
          name="q"
          className="w-3/4 shadow-sm focus:ring-indigo-500 focus:border-indigo"
          placeholder="Pppp Pokemon"
        />
        <button
          type="submit"
          className="mx-4 inline-flex items-center px-3 py-2 border hover:bg-red-700 bg-blue-100"
        >
          Search
        </button>
      </pokemon.Form>
      <br/>
      <ul
        role="list"
        className="grid grid-cols-2 gap-x-4, gap-y-8 sm:grid-cols-3"
      >
        {pokemonList.map((p) => (
          <li key={p.id} className="relative">
            <Link to={`/pokemon/${p.name}`}>
              <div className="hover:scale-110 transition duration-200 group block w-full aspect-w-10 aspect-h-8 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
                <img
                  src={`/pokemon/${p.name.toLowerCase()}.jpg`}
                  alt=""
                  className="object-cover pointer-events-none group-hover:opacity-75"
                />
              </div>
              <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
                {p.name}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
