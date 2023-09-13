import { KeyState } from "./key-state";
import { Point } from "./point";

export class InputState {
  move = new Point(0, 0);
  shoot = false;

  private keyState: KeyState;

  constructor(target: HTMLElement | (Window & typeof globalThis) = window) {
    this.keyState = new KeyState(target);
  }

  update() {
    const deltaX =
      (this.keyState.isPressed("d") ? 1 : 0) - (this.keyState.isPressed("a") ? 1 : 0);
    const deltaY =
      (this.keyState.isPressed("w") ? 1 : 0) - (this.keyState.isPressed("s") ? 1 : 0);

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance > 1) {
      this.move.x = deltaX / distance;
      this.move.y = deltaY / distance;
    } else {
      this.move.x = deltaX;
      this.move.y = deltaY;
    }

    this.shoot = this.keyState.isPressed(" ");
  }

  stop() {
    this.keyState.stop();
  }
}
