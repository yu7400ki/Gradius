import type { Game } from "./types/game";
import type { Renderer } from "./engine";
import { Player, Bullet } from "./entity";
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
    await Bullet.initialize();
    this.me = new Player(100, 100, "right");
  }

  update() {
    this.me.move(this.inputState.move);
    if (this.inputState.shoot) {
      this.me.shoot();
    } else {
      this.me.idle();
    }
    Player.manager.forEach((player) => player.update());
    Bullet.manager.forEach((bullet) => bullet.update());
  }

  draw(renderer: Renderer): void {
    renderer.clear();
    Player.manager.forEach((player) => player.draw(renderer));
    Bullet.manager.forEach((bullet) => bullet.draw(renderer));
  }

  stop() {
    this.inputState.stop();
    Player.deleteAll();
    Bullet.deleteAll();
  }
}
