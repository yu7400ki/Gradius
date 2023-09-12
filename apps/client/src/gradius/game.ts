import type { Game } from "./types/game";

export class Gradius implements Game {
  initialize(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  update(): void {
    throw new Error("Method not implemented.");
  }
  draw(): void {
    throw new Error("Method not implemented.");
  }
}
