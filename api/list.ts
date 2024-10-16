import { ITEMS_PER_PAGE } from "@/constants";

const abortControllerMap: Record<string, AbortController> = {};

async function getPokemonList({
  page = 1,
  limit = ITEMS_PER_PAGE,
}: {
  page?: number;
  limit?: number;
}) {
  if (abortControllerMap.getPokemonList) {
    abortControllerMap.getPokemonList.abort();
  }

  abortControllerMap.getPokemonList = new AbortController();

  const url =
    `https://pokeapi.co/api/v2/pokemon?` +
    new URLSearchParams({
      limit: limit.toString(),
      offset: ((page - 1) * ITEMS_PER_PAGE).toString(),
    }).toString();

  try {
    const response = await fetch(url, {
      signal: abortControllerMap.getPokemonList.signal,
    });
    const data = await response.json();

    return {
      count: data.count,
      results: data.results.slice(0, ITEMS_PER_PAGE),
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}

async function getTypeList() {
  if (abortControllerMap.getTypeList) {
    abortControllerMap.getTypeList.abort();
  }

  abortControllerMap.getTypeList = new AbortController();

  const url = `https://pokeapi.co/api/v2/type`;

  try {
    const response = await fetch(url, {
      signal: abortControllerMap.getPokemonList.signal,
    });
    const data = await response.json();

    return {
      count: data.count,
      results: data.results,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}

async function getTypeDetail({ url }: { url: string }) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      count: data.pokemon.length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results: data.pokemon.map((item: any) => item.pokemon),
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}

export async function fetchPokemon({ page = 1 }: { page?: number }) {
  try {
    const pokemonData = await getPokemonList({ page });
    return pokemonData;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}

export async function fetchType() {
  try {
    const pokemonData = await getTypeList();
    return pokemonData;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}

export async function fetchTypeDetail({ url }: { url: string }) {
  try {
    const pokemonData = await getTypeDetail({ url });
    return pokemonData;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}
