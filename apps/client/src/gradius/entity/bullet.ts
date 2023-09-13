import { loadImage } from "../browser";
import type { Renderer } from "../engine";
import { Point, Rect } from "../engine";

const SCALE = 2;

export class Bullet {
  static WIDTH = 7 * SCALE;
  static HEIGHT = 7 * SCALE;
  static manager = new Set<Bullet>();
  private static bulletRed: HTMLImageElement;
  private static bulletBlue: HTMLImageElement;
  private static initialized = false;

  context: BulletContext;

  static async initialize() {
    Bullet.bulletBlue = await loadImage(
      "/assets/images/entity/bullet_blue.png",
    );
    Bullet.bulletRed = await loadImage("/assets/images/entity/bullet_red.png");
    Bullet.initialized = true;
  }

  constructor(x: number, y: number, direction: "left" | "right") {
    if (!Bullet.initialized) {
      throw new Error("Bullet is not initialized");
    }

    const velocity = new Point(direction === "right" ? 10 : -10, 0);
    this.context = new BulletContext(new Point(x, y), velocity, direction);
    Bullet.manager.add(this);
  }

  static deleteAll() {
    Bullet.manager.clear();
  }

  get box() {
    return new Rect(this.context.position, Bullet.WIDTH, Bullet.HEIGHT);
  }

  draw(renderer: Renderer) {
    const image =
      this.context.direction === "right" ? Bullet.bulletBlue : Bullet.bulletRed;
    renderer.drawImage(image, this.box);
    // renderer.drawRect(this.box);
  }

  update() {
    this.context.update();
  }

  delete() {
    Bullet.manager.delete(this);
  }
}

class BulletContext {
  position: Point;
  velocity: Point;
  direction: "left" | "right";

  constructor(position: Point, velocity: Point, direction: "left" | "right") {
    this.position = position;
    this.velocity = velocity;
    this.direction = direction;
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
