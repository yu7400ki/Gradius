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
}
