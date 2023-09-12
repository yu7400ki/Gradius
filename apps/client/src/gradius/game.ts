import type { Game } from "./types/game";
import type { Renderer } from "./engine";
import { Player } from "./entity";
import { InputState } from "./engine";

export class Gradius implements Game {
  width: number;
  height: number;

  inputState = new InputState();
  me: Player;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  async initialize() {
    await Player.initialize();
    this.me = new Player(100, 100, "right");
  }

  update() {
    this.me.move(this.inputState.move);
    if (this.inputState.shoot) {
      this.me.shoot();
    } else {
      this.me.idle();
    }
    this.me.update();
  }

  draw(renderer: Renderer): void {
    renderer.clear();
    this.me.draw(renderer);
  }

  stop() {
    this.inputState.stop();
  }
}
