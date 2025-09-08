"use client";

import React, { useEffect, useState, useRef } from "react";
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

export default function GamePage() {
  const searchParam = useSearchParams();
  const gameId = searchParam.get("id");
  const cover_ref = useRef<HTMLDivElement>(null);
  const [resizeTrigger, setResizeTrigger] = useState(0);

  const [gameData, setGameData] = useState<any>(null);
  const [coverData, setCoverData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cover_height, setCoverHeight] = useState(0);

  async function fetchGameData() {
    setLoading(true);
    try {
      const query: GameQuery = {
        filters: { id: parseInt(gameId as string, 10) },
        limit: 1,
      };

      const response = await axios.post("/api/igdb/gameData", query);
      console.log("API Response:", response.data);
      if (response.data.games.length > 0) {
        const game = response.data.games[0];
        const cover = response.data.covers[0];
        console.log(response.data);
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

  useEffect(() => {
    const updateHeight = () => {
      if (cover_ref.current) {
        setCoverHeight(cover_ref.current.clientHeight);
      }
    };
    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);

    if (cover_ref.current) {
      resizeObserver.observe(cover_ref.current);
    }
    const intervalId = setInterval(updateHeight, 500);
    return () => {
      resizeObserver.disconnect();
      clearInterval(intervalId);
    };
  }, [coverData, resizeTrigger]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setResizeTrigger((prev) => prev + 1), 100);
    }
  }, [loading]);

  return loading ? (
    <div className="text-5xl text-yellow-500 flex justify-center">
      Loading your game...
      <i className="snes-logo"></i>
    </div>
  ) : (
    <div className="flex flex-row justify-center">
      <div className="nes-container is-dark is-centered max-w-3xl">
        <h1 className="text-4xl">{gameData?.name}</h1>
        <div className="flex flex-row gap-4 items-start">
          {coverData?.image_id && (
            <div
              ref={cover_ref}
              className="relative nes-container is-rounded min-w-[40%] aspect-[3/4] flex-shrink-0"
            >
              <Image
                src={`https://images.igdb.com/igdb/image/upload/t_1080p/${coverData.image_id}.jpg`}
                alt={`${gameData?.name} Cover`}
                fill
                className="object-cover"
                onLoad={() =>
                  setTimeout(() => setResizeTrigger((prev) => prev + 1), 100)
                }
              />
            </div>
          )}
          <div className="flex flex-col">
            <div
              className="overflow-y-auto flex-grow mt-[3%]"
              style={{
                maxHeight: cover_height > 0 ? `${cover_height}px` : "none",
              }}
            >
              <p className="font-mono text-md">{gameData?.summary}</p>
            </div>
          </div>
        </div>
        <div className="text-6xl text-yellow-500 mb-4">
          {gameData?.aggregated_rating &&
            `${Math.round(gameData.aggregated_rating)}/100`}
        </div>
      </div>
    </div>
  );
}
