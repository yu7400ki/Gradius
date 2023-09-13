import type { Game } from "./types/game";
import type { Renderer } from "./engine";
import { Player, Bullet, Enemy } from "./entity";
import { InputState } from "./engine";
import { Boom } from "./effect/boom";

export class Gradius implements Game {
  width: number;
  height: number;
  debug = false;

  inputState = new InputState();
  me: Player;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    window.gradius = this;
  }

  async initialize() {
    await Player.initialize();
    await Bullet.initialize();
    await Enemy.initialize();
    await Boom.initialize();
    this.me = new Player(100, 100, "right");
    this.spawnEnemy();
  }

  private spawnEnemy() {
    const x = Math.random() * this.width;
    const y = Math.random() * this.height;
    const dx = 0;
    const dy = 0;
    return new Enemy(x, y, dx, dy);
  }

  update() {
    this.inputState.update();
    this.me.move(this.inputState.move);
    if (this.inputState.shoot) {
      this.me.shoot();
    } else {
      this.me.idle();
    }
    Enemy.manager.forEach((enemy) => {
      Bullet.manager.forEach((bullet) => {
        enemy.checkCollision(bullet);
      });
      Player.manager.forEach((player) => {
        enemy.checkCollision(player);
      });
    });
    Player.manager.forEach((player) => player.update());
    Enemy.manager.forEach((enemy) => enemy.update());
    Bullet.manager.forEach((bullet) => bullet.update());
    Boom.manager.forEach((boom) => boom.update());
  }

  draw(renderer: Renderer): void {
    renderer.clear();
    Player.manager.forEach((player) => player.draw(renderer));
    Enemy.manager.forEach((enemy) => enemy.draw(renderer));
    Bullet.manager.forEach((bullet) => bullet.draw(renderer));
    Boom.manager.forEach((boom) => boom.draw(renderer));
    if (this.debug) {
      Player.manager.forEach((player) => player.drawHitBox(renderer));
      Enemy.manager.forEach((enemy) => enemy.drawHitBox(renderer));
      Bullet.manager.forEach((bullet) => bullet.drawHitBox(renderer));
    }
  }

  stop() {
    this.inputState.stop();
    Player.deleteAll();
    Bullet.deleteAll();
    Enemy.deleteAll();
    Boom.deleteAll();
    window.gradius = void 0;
  }
}
