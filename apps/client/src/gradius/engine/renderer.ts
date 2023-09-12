import type { Rect } from "./rect";

export class Renderer {
  context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  clear() {
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height,
    );
  }

  drawImage(image: HTMLImageElement, frame: Rect) {
    this.context.drawImage(
      image,
      frame.point.x,
      frame.point.y,
      frame.width,
      frame.height,
    );
  }
}
