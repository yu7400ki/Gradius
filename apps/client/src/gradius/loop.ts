import type { Game } from "./types/game";
import { Renderer } from "./engine/renderer";

const FRAME_SIZE = (1.0 / 40.0) * 1000.0;

export class GameLoop {
  lastFrame: number;
  accumulatedDelta: number;
  requestId: number;

  constructor() {
    this.lastFrame = performance.now();
    this.accumulatedDelta = 0;
    this.requestId = 0;
  }

  static async start(game: Game, ctx: CanvasRenderingContext2D) {
    await game.initialize();
    const instance = new GameLoop();
    const renderer = new Renderer(ctx);

    const loop = (pref: number) => {
      instance.accumulatedDelta += pref - instance.lastFrame;

      while (instance.accumulatedDelta > FRAME_SIZE) {
        game.update();
        instance.accumulatedDelta -= FRAME_SIZE;
      }

      instance.lastFrame = pref;
      game.draw(renderer);
      instance.requestId = requestAnimationFrame(loop);
    };

    instance.requestId = requestAnimationFrame(loop);
    return instance;
  }

  stop() {
    cancelAnimationFrame(this.requestId);
  }
}
