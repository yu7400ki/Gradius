import { loadImage } from "../browser";
import type { Renderer } from "../engine";
import { Point, Rect } from "../engine";

const Event = {
  BOOMING: "BOOMING",
  END: "END",
} as const;

export class Boom {
  static WIDTH = 60;
  static HEIGHT = 60;
  static manager = new Set<Boom>();
  static images: [
    HTMLImageElement,
    HTMLImageElement,
    HTMLImageElement,
    HTMLImageElement,
    HTMLImageElement,
  ];
  static initialized: boolean;

  state: BoomState;

  static async initialize() {
    Boom.images = await Promise.all([
      loadImage("/assets/images/effect/boom/boom1.png"),
      loadImage("/assets/images/effect/boom/boom2.png"),
      loadImage("/assets/images/effect/boom/boom3.png"),
      loadImage("/assets/images/effect/boom/boom4.png"),
      loadImage("/assets/images/effect/boom/boom5.png"),
    ]);
    Boom.initialized = true;
  }

  static deleteAll() {
    Boom.manager.clear();
  }

  constructor(x: number, y: number) {
    if (!Boom.initialized) {
      throw new Error("Boom is not initialized");
    }

    this.state = new BoomStateBooming(new BoomContext(new Point(x, y)));
    Boom.manager.add(this);
  }

  get box() {
    return new Rect(this.state.context.position, Boom.WIDTH, Boom.HEIGHT);
  }

  update() {
    this.state = this.state.update();
    if (this.state.constructor === BoomStateEnd) {
      this.delete();
    }
  }

  draw(renderer: Renderer) {
    const image = Boom.images[this.state.imageFrame];
    renderer.drawImage(image, this.box);
  }

  delete() {
    Boom.manager.delete(this);
  }
}

class BoomContext {
  position: Point;
  frame: number;

  constructor(position: Point) {
    this.position = position;
    this.frame = 0;
  }

  update(frameCount: number) {
    this.frame++;
    this.frame %= frameCount + 1;
  }

  resetFrame() {
    this.frame = 0;
    return this;
  }
}

interface BoomState {
  frameCount: number;
  context: BoomContext;
  imageFrame: number;
  update: () => BoomState;
  transition: (event: (typeof Event)[keyof typeof Event]) => BoomState;
}

class BoomStateBooming implements BoomState {
  frameLength = 3;
  frameCount = 5 * this.frameLength;
  context: BoomContext;

  constructor(context: BoomContext) {
    this.context = context;
  }

  get imageFrame() {
    return Math.floor(this.context.frame / this.frameLength);
  }

  transition(event: (typeof Event)[keyof typeof Event]) {
    switch (event) {
      case Event.END:
        return this.end();
      default:
        return this;
    }
  }

  update() {
    this.context.update(this.frameCount);
    if (this.context.frame === this.frameCount) {
      return this.end();
    }
    return this;
  }

  end() {
    return new BoomStateEnd(this.context.resetFrame());
  }
}

class BoomStateEnd implements BoomState {
  frameCount = 0;
  context: BoomContext;
  readonly imageFrame = 4;

  constructor(context: BoomContext) {
    this.context = context;
  }

  transition() {
    return this;
  }

  update() {
    this.context.update(this.frameCount);
    return this;
  }
}
