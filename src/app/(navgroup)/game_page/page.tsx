"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
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

export default function GamePage() {
  const searchParam = useSearchParams();
  const gameId = searchParam.get("id");

  const [gameData, setGameData] = useState<any>(null);
  const [coverData, setCoverData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function fetchGameData() {
    setLoading(true);
    try {
      const query: GameQuery = {
        filters: { id: parseInt(gameId as string, 10) },
        limit: 1,
      };

      const response = await axios.post("/api/igdb/gameData", query);
      if (response.data.games.length > 0) {
        const game = response.data.games[0];
        const cover = response.data.covers[0];
        setCoverData(cover);
        setGameData(game);
      }
    } catch (error) {
      console.log("Failed to fetch game data, ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (gameId) {
      fetchGameData();
    }
  }, [gameId]);

  return (
    <div className="flex flex-row justify-center">
      <div className="nes-container is-dark is-centered max-w-3xl">
        <h1 className="text-4xl">{gameData?.name}</h1>
        <div className="flex flex-row gap-4 items-start">
          {/* Cover image on the right */}
          {coverData?.image_id && (
            <div className="relative nes-container is-dark is-centered is-rounded min-w-[40%] aspect-[3/4] flex-shrink-0">
              <Image
                src={`https://images.igdb.com/igdb/image/upload/t_1080p/${coverData.image_id}.jpg`}
                alt={`${gameData.name} Cover`}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0 font-mono">
            <p className="text-base leading-relaxed">{gameData?.summary}</p>
          </div>
        </div>
        <div className="text-6xl text-yellow-500 mb-4">
          {gameData.aggregated_rating}/100
        </div>
      </div>
    </div>
  );
}
