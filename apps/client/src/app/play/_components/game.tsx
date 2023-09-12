"use client";

import { useRef, useEffect, useCallback } from "react";
import { GameLoop, Gradius } from "@/gradius";
import { css } from "@styled-system/css";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradius = useRef<Gradius>(
    new Gradius(window.innerWidth, window.innerHeight),
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      throw new Error("Canvas not found");
    }
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
      throw new Error("Canvas context not found");
    }

    const game = gradius.current;
    let loop: GameLoop | null = null;
    GameLoop.start(game, ctx)
      .then((l) => {
        loop = l;
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      loop?.stop();
      game.stop();
    };
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    window.dispatchEvent(new Event("resize"));
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <canvas
      className={css({
        width: "screen",
        height: "screen",
      })}
      ref={canvasRef}
    />
  );
};

export default Game;
