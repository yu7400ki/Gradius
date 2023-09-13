import type { Point } from "./point";

export class Rect {
  point: Point;
  width: number;
  height: number;

  constructor(point: Point, width: number, height: number) {
    this.point = point;
    this.width = width;
    this.height = height;
  }

  intersects(rect: Rect) {
    return (
      this.point.x < rect.point.x + rect.width &&
      this.point.x + this.width > rect.point.x &&
      this.point.y < rect.point.y + rect.height &&
      this.point.y + this.height > rect.point.y
    );
  }
}
