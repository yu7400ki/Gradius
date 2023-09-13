import type { Renderer, Rect } from "../engine";

export interface Entity {
  update: () => void;
  draw: (renderer: Renderer) => void;
  box: Rect;
}
