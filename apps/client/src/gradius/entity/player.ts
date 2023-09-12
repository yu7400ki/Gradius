import { loadImage } from "../browser";
import type { Renderer } from "../engine";
import { Point, Rect } from "../engine";

const SCALE = 2;
const MOVE_SPEED = 5;

export class Player {
  static WIDTH = 33 * SCALE;
  static HEIGHT = 36 * SCALE;
  private static angleLeft = document.createElement("canvas");
  private static angleRight = document.createElement("canvas");
  private static initialized = false;

  rect: Rect;
  dx = 0;
  dy = 0;
  direction: "left" | "right";

  static async initialize() {
    const image = await loadImage("/assets/images/entity/spaceship.png");
    const angleLeft = Player.angleLeft;
    angleLeft.width = Player.WIDTH;
    angleLeft.height = Player.HEIGHT;
    const angleRight = Player.angleRight;
    angleRight.width = Player.WIDTH;
    angleRight.height = Player.HEIGHT;
    const contextLeft = angleLeft.getContext("2d");
    const contextRight = angleRight.getContext("2d");
    if (!contextLeft || !contextRight) {
      throw new Error("Failed to get context");
    }
    contextRight.drawImage(image, 0, 0, Player.WIDTH, Player.HEIGHT);
    contextLeft.save();
    contextLeft.translate(Player.WIDTH, 0);
    contextLeft.scale(-1, 1);
    contextLeft.drawImage(image, 0, 0, Player.WIDTH, Player.HEIGHT);
    contextLeft.restore();
    Player.initialized = true;
  }

  constructor(x: number, y: number, direction: "left" | "right") {
    if (!Player.initialized) {
      throw new Error("Player is not initialized");
    }

    this.rect = new Rect(new Point(x, y), Player.WIDTH, Player.HEIGHT);
    this.direction = direction;
  }

  draw(renderer: Renderer) {
    const image =
      this.direction === "right" ? Player.angleRight : Player.angleLeft;
    renderer.drawImage(image, this.rect);
  }

  update() {
    this.rect.point.x += this.dx;
    this.rect.point.y += this.dy;
  }

  move(move: Point) {
    this.dx = move.x * MOVE_SPEED;
    this.dy = move.y * -MOVE_SPEED;
  }
}
