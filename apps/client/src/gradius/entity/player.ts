import { loadImage } from "../browser";
import type { Renderer } from "../engine";
import { Point, Rect } from "../engine";

const SCALE = 2;
const MOVE_SPEED = 5;
const Event = {
  IDLE: "IDLE",
  SHOOTING: "SHOOTING",
} as const;

export class Player {
  static WIDTH = 33 * SCALE;
  static HEIGHT = 36 * SCALE;
  private static angleLeft = document.createElement("canvas");
  private static angleRight = document.createElement("canvas");
  private static initialized = false;

  state: PlayerState;

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

    this.state = new PlayerStateIdle(
      new PlayerContext(new Point(x, y), new Point(0, 0), direction),
    );
  }

  get box() {
    return new Rect(this.state.context.position, Player.WIDTH, Player.HEIGHT);
  }

  draw(renderer: Renderer) {
    const image =
      this.state.context.direction === "right"
        ? Player.angleRight
        : Player.angleLeft;
    renderer.drawImage(image, this.box);
  }

  move(move: Point) {
    this.state.context.move(move);
  }

  update() {
    this.state = this.state.update();
  }

  shoot() {
    this.state = this.state.transition(Event.SHOOTING);
  }

  idle() {
    this.state = this.state.transition(Event.IDLE);
  }
}

class PlayerContext {
  position: Point;
  velocity: Point;
  direction: "left" | "right";
  frame: number;

  constructor(position: Point, velocity: Point, direction: "left" | "right") {
    this.position = position;
    this.velocity = velocity;
    this.direction = direction;
    this.frame = 0;
  }

  move(move: Point) {
    this.velocity.x = move.x * MOVE_SPEED;
    this.velocity.y = move.y * -MOVE_SPEED;
  }

  update(frameCount: number) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.frame += 1;
    this.frame %= frameCount + 1;
  }

  resetFrame() {
    this.frame = 0;
    return this;
  }
}

interface PlayerState {
  frameCount: number;
  context: PlayerContext;
  update: () => PlayerState;
  transition: (event: (typeof Event)[keyof typeof Event]) => PlayerState;
}

class PlayerStateIdle implements PlayerState {
  frameCount = 0;
  context: PlayerContext;

  constructor(context: PlayerContext) {
    this.context = context;
  }

  transition(event: (typeof Event)[keyof typeof Event]) {
    switch (event) {
      case Event.SHOOTING:
        return this.shoot();
      default:
        return this;
    }
  }

  update() {
    this.context.update(this.frameCount);
    return this;
  }

  shoot() {
    return new PlayerStateShooting(this.context.resetFrame());
  }
}

class PlayerStateShooting implements PlayerState {
  frameCount = 10;
  context: PlayerContext;

  constructor(context: PlayerContext) {
    this.context = context;
  }

  transition(event: (typeof Event)[keyof typeof Event]) {
    switch (event) {
      case Event.IDLE:
        return this.idle();
      default:
        return this;
    }
  }

  update() {
    this.context.update(this.frameCount);
    return this;
  }

  idle() {
    return new PlayerStateIdle(this.context.resetFrame());
  }
}
