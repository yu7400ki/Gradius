"use client";

import { useRef, useEffect, useCallback } from "react";
import { GameLoop, Gradius } from "@/gradius";
import { css } from "@styled-system/css";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useRef<Gradius>(new Gradius());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      throw new Error("Canvas not found");
    }
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
      throw new Error("Canvas context not found");
    }

    let loop: GameLoop | null = null;
    GameLoop.start(game.current, ctx)
      .then((l) => {
        loop = l;
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      loop?.stop();
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
