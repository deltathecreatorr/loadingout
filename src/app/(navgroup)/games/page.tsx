"use client";
import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface GameQuery {
  filters?: Record<string, any>;
  sort?: Record<string, any>;
  limit?: number;
  skip?: number;
  projection?: Record<string, 1>;
}
interface GameResponse {
  query_name: string;
  games: any[];
  covers: any[];
  error?: string;
}

export default function Games() {
  const [query_list, setQueryList] = useState<GameResponse[]>([]);
  const [loading, setLoading] = React.useState(false);

  async function fetchGames(
    query: GameQuery,
    query_name: string
  ): Promise<GameResponse> {
    const game_response: GameResponse = {
      query_name: query_name,
      games: [],
      covers: [],
    };
    try {
      const response = await axios.post("/api/igdb/gameData", query);
      game_response.covers = response.data.covers;
      game_response.games = response.data.games;
      return game_response;
    } catch (err: any) {
      return {
        query_name,
        games: [],
        covers: [],
        error: "Failed to fetch games: " + err.message,
      };
    }
  }

  //fetch games from db using API
  useEffect(() => {
    async function fetchAllGames() {
      setLoading(true);
      try {
        const gameQueries = [
          {
            query: {
              filters: { total_rating_count: { $gte: 1500 } },
              sort: { total_rating: "desc" },
              limit: 10,
            },
            name: "Top 10 Games Of All Time",
          },
          {
            query: {
              filters: {
                total_rating: { $gte: 80 },
                first_release_date: {
                  $gt: Math.floor(Date.now() / 1000) - 91 * 24 * 60 * 60, // Last 3 months
                },
              },
              sort: { total_rating: "desc" },
              limit: 10,
            },
            name: "Popular New Releases",
          },
          {
            query: {
              filters: {
                first_release_date: {
                  $gte: Math.floor(Date.now() / 1000),
                  $lte: Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60,
                },
              },
              sort: { first_release_date: "asc" },
              limit: 20,
            },
            name: "Coming Soon",
          },
        ];

        const results = await Promise.all(
          gameQueries.map(async ({ query, name }) => {
            try {
              return await fetchGames(query, name);
            } catch (error) {
              console.error(`Error fetching games for ${name}:`, error);
              return {
                query_name: name,
                games: [],
                covers: [],
                error:
                  error instanceof Error
                    ? error.message
                    : "Failed to fetch games",
              };
            }
          })
        );

        setQueryList(results);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllGames();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <span className="text-2xl text-yellow-500 mr-1">
            Loading games...
          </span>
        </div>
      ) : (
        <div>
          {query_list.map((query, index) => (
            <div key={index} className="mb-12">
              <h1 className="text-3xl text-black mb-8">{query.query_name}</h1>

              {query.error ? (
                <div className="text-red-500">{query.error}</div>
              ) : query.games.length === 0 ? (
                <div className="text-gray-500">No games found</div>
              ) : (
                <div className="flex overflow-x-scroll gap-4 pb-4 rounded-box w-full">
                  {query.games.map((game) => (
                    <GameCard key={game.id} game={game} covers={query.covers} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GameCard({ game, covers }: { game: any; covers: any[] }) {
  const router = useRouter();
  const gameCover = covers.find((c) => c.game === game.id);
  const imageId = gameCover?.image_id;

  const [imageSrc, setImageSrc] = useState(() => {
    if (imageId) {
      return `https://images.igdb.com/igdb/image/upload/t_1080p/${imageId}.jpg`;
    }
    return "";
  });

  useEffect(() => {
    if (imageId) {
      setImageSrc(
        `https://images.igdb.com/igdb/image/upload/t_1080p/${imageId}.jpg`
      );
    }
  }, [imageId]);

  return (
    <div className="relative card font-mono group h-full">
      {/* Background Image Container */}
      <div className="relative w-[220px] h-[300px]">
        <Image
          src={imageSrc}
          alt={`${game.name} Cover`}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>

      {/* Overlay Content */}
      <div className="card-body opacity-0 invisible rounded-lg group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-black/70 absolute inset-0 flex flex-col justify-end p-4">
        <h2 className="card-title text-white text-lg line-clamp-2">
          {game.name}
        </h2>
        {game.summary && (
          <p className="text-white text-sm line-clamp-3 mb-2">{game.summary}</p>
        )}
        <div className="flex items-center mb-2">
          <span className="text-yellow-500 mr-1">★</span>
          <span className="text-white">
            {game.aggregated_rating
              ? `${Math.round(game.total_rating)}/100`
              : "Unrated"}
          </span>
        </div>
        <div className="card-actions justify-end">
          <button
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-black rounded-lg group bg-gradient-to-br from-purple-600 to-black-500 group-hover:from-purple-600 group-hover:to-purple-800 hover:text-black dark:text-black"
            onClick={() => router.push(`/game_page?id=${game.id}`)}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              See More
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
