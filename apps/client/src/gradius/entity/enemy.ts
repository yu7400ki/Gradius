import { loadImage } from "../browser";
import type { Renderer } from "../engine";
import { Point, Rect } from "../engine";
import type { Entity } from "../types/entity";

const SCALE = 3;
const SCREEN_WIDTH = 1920;
const SCREEN_HEIGHT = 1080;

export class Enemy implements Entity {
  static WIDTH = 20 * SCALE;
  static HEIGHT = 11 * SCALE;
  static manager = new Set<Enemy>();
  private static enemy: HTMLImageElement;
  private static initialized = false;

  context: EnemyContext;

  static async initialize() {
    Enemy.enemy = await loadImage("/assets/images/entity/ufo.png");
    Enemy.initialized = true;
  }

  constructor(x: number, y: number, dx: number, dy: number) {
    if (!Enemy.initialized) {
      throw new Error("Enemy is not initialized");
    }

    const position = new Point(x, y);
    const velocity = new Point(dx, dy);
    this.context = new EnemyContext(position, velocity);
    Enemy.manager.add(this);
  }

  static deleteAll() {
    Enemy.manager.clear();
  }

  get box() {
    return new Rect(this.context.position, Enemy.WIDTH, Enemy.HEIGHT);
  }

  inScreen() {
    return (
      this.context.position.x + Enemy.WIDTH > 0 &&
      this.context.position.x < SCREEN_WIDTH &&
      this.context.position.y + Enemy.HEIGHT > 0 &&
      this.context.position.y < SCREEN_HEIGHT
    );
  }

  checkCollision(entity: Entity) {
    if (this.box.intersects(entity.box)) {
      entity.onCollision?.(this);
      this.onCollision(entity);
    }
  }

  draw(renderer: Renderer) {
    renderer.drawImage(Enemy.enemy, this.box);
    // renderer.drawRect(this.box);
  }

  update() {
    this.context.update();
    if (!this.inScreen()) {
      this.delete();
    }
  }

  onCollision(_: Entity) {
    this.delete();
  }

  delete() {
    Enemy.manager.delete(this);
  }
}

class EnemyContext {
  position: Point;
  velocity: Point;

  constructor(position: Point, velocity: Point) {
    this.position = position;
    this.velocity = velocity;
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
