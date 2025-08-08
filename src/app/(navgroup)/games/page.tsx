"use client";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Image from "next/image";

export interface Game {
  id: number;
  name: string;
  summary: string;
  rating: number;
  cover: {
    url: string;
  };
}

export default function Games() {
  const [games, setGames] = React.useState<Game[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  //fetch games from db instead of API
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/igdb/get24hrData");
        setGames(response.data.games);
      } catch (err: any) {
        setError("Failed to fetch games " + err);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    console.log(games);
    fetchGames();
  }, [error, games]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster></Toaster>
      <h1 className="text-3xl text-black mb-8">Top 10 Popular Games</h1>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <span className="text-lg text-yellow-500 mr-1">Loading games...</span>
        </div>
      ) : (
        <div className="flex overflow-x-scroll gap-4 pb-4 rounded-box w-full">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}

function GameCard({ game }: { game: Game }) {
  return (
    <div className="relative card font-mono group h-full">
      {/* Background Image Container */}
      <figure className="relative w-[220px] h-[300px]">
        <Image
          src={
            game.cover?.url.startsWith("http")
              ? game.cover.url
              : `https:${game.cover?.url}`
          }
          alt={`${game.name} cover`}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false} // Let Next.js optimize loading
        />
      </figure>

      {/* Overlay Content */}
      <div className="card-body opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-black/70 absolute inset-0 flex flex-col justify-end p-4">
        <h2 className="card-title text-white text-lg line-clamp-2">
          {game.name}
        </h2>
        {game.summary && (
          <p className="text-white text-sm line-clamp-3 mb-2">{game.summary}</p>
        )}
        <div className="flex items-center mb-2">
          <span className="text-yellow-500 mr-1">★</span>
          <span className="text-white">{Math.round(game.rating || 0)}/100</span>
        </div>
        <div className="card-actions justify-end">
          <button className="btn btn-primary btn-sm">Add to List</button>
        </div>
      </div>
    </div>
  );
}
