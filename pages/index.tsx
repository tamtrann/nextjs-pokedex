import { fetchPokemon, fetchType, fetchTypeDetail } from "@/api/list";
import PokemonCard from "@/components/PokemonCard";
import { ITEMS_PER_PAGE } from "@/constants";
import { Item } from "@/types/pokemon";
import localFont from "next/font/local";
import { useCallback, useEffect, useMemo, useState } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pokemons, setPokemons] = useState<Item[]>([]);
  const [types, setTypes] = useState<Item[]>([]);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    // If filtering by type, disable fetching by page because the whole list is available
    if (selectedType) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const data = await fetchPokemon({
        page,
      });

      if (data) {
        const { count, results: newPokemon } = data;
        setCount(count);
        setPokemons(newPokemon);
      }
      setLoading(false);
    };

    fetchData();
  }, [page, selectedType]);

  useEffect(() => {
    if (!selectedType) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const data = await fetchTypeDetail({
        url: selectedType,
      });

      if (data) {
        const { count, results: newPokemon } = data;
        setCount(count);
        setPokemons(newPokemon);
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedType]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchType();

      if (data) {
        setTypes(data.results);
      }
    };

    fetchData();
  }, []);

  const totalPages = useMemo(() => Math.ceil(count / ITEMS_PER_PAGE), [count]);

  const displayedPokemons = useMemo(() => {
    if (selectedType) {
      return pokemons.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    }

    return pokemons;
  }, [pokemons, selectedType, page]);

  const handleTypeChange = useCallback((type: string) => {
    setSelectedType(type);
    setPage(1);
  }, []);

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} bg-gray-100 dark:bg-gray-900 flex flex-col gap-8 min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <ul className="text-sm font-medium text-center flex flex-wrap gap-2 w-full">
        {types.map((type) => (
          <li
            key={type.url}
            className={`focus-within:z-10 w-24 ${
              loading ? "cursor-wait" : "cursor-pointer"
            }`}
            onClick={() => {
              if (loading) {
                return;
              }
              handleTypeChange(type.url === selectedType ? "" : type.url);
            }}
          >
            <span
              className={`flex items-center justify-center px-3 h-8 text-sm font-medium text-white rounded-sm hover:bg-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none capitalize ${
                type.url === selectedType
                  ? "bg-gray-700 dark:bg-gray-700 dark:text-white"
                  : "bg-gray-500 dark:bg-gray-800"
              }`}
            >
              {type.name}
            </span>
          </li>
        ))}
      </ul>
      <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10 grid-flow-row auto-rows-max w-full">
        {displayedPokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.url}
            name={pokemon.name}
            url={pokemon.url}
          />
        ))}
      </main>
      <footer className="flex flex-col gap-2 flex-wrap items-center justify-center">
        <span className="text-sm text-gray-700 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {(page - 1) * ITEMS_PER_PAGE + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {Math.min(page * ITEMS_PER_PAGE, count)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {count}
          </span>{" "}
          Entries
        </span>
        <div className="inline-flex mt-2 xs:mt-0">
          <button
            className={`flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-500 rounded-s hover:bg-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
              loading ? "cursor-wait" : "cursor-pointer"
            }`}
            onClick={() => {
              if (loading) {
                return;
              }
              setPage((prev) => Math.max(prev - 1, 1));
            }}
          >
            Prev
          </button>
          <button
            className={`flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-500 border-0 border-s border-gray-500 rounded-e hover:bg-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
              loading ? "cursor-wait" : "cursor-pointer"
            }`}
            onClick={() => {
              if (loading) {
                return;
              }
              setPage((prev) => Math.min(prev + 1, totalPages));
            }}
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  );
}
