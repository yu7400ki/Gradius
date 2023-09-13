import type { Game } from "./types/game";
import type { Renderer } from "./engine";
import { Player, Bullet, Enemy } from "./entity";
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
    await Enemy.initialize();
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
  }

  draw(renderer: Renderer): void {
    renderer.clear();
    Player.manager.forEach((player) => player.draw(renderer));
    Enemy.manager.forEach((enemy) => enemy.draw(renderer));
    Bullet.manager.forEach((bullet) => bullet.draw(renderer));
  }

  stop() {
    this.inputState.stop();
    Player.deleteAll();
    Bullet.deleteAll();
    Enemy.deleteAll();
  }
}
