import type { Renderer } from "../engine/renderer";

export interface Game {
  initialize: () => Promise<void>;
  update: () => void;
  draw: (renderer: Renderer) => void;
}
