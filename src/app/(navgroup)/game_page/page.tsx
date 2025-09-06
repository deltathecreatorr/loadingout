"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Games from "../games/page";

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
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">{gameData?.name}</h1>
    </div>
  );
}
