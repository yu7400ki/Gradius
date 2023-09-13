import { Point } from "./point";

export class InputState {
  move = new Point(0, 0);
  shoot = false;

  private pressedKey = new Map<string, KeyboardEvent>();
  readonly target: HTMLElement | (Window & typeof globalThis);

  constructor(target: HTMLElement | (Window & typeof globalThis) = window) {
    this.target = target;
    this.target.addEventListener(
      "keydown",
      this.handleKeyDown.bind(this) as EventListener,
    );
    this.target.addEventListener(
      "keyup",
      this.handleKeyUp.bind(this) as EventListener,
    );
  }

  private handleKeyDown(event: KeyboardEvent) {
    this.press(event.key, event);
    this.update();
  }

  private handleKeyUp(event: KeyboardEvent) {
    this.release(event.key);
    this.update();
  }

  private update() {
    const deltaX =
      (this.isPressed("d") ? 1 : 0) - (this.isPressed("a") ? 1 : 0);
    const deltaY =
      (this.isPressed("w") ? 1 : 0) - (this.isPressed("s") ? 1 : 0);

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance > 1) {
      this.move.x = deltaX / distance;
      this.move.y = deltaY / distance;
    } else {
      this.move.x = deltaX;
      this.move.y = deltaY;
    }

    this.shoot = this.isPressed(" ");
  }

  isPressed(key: string) {
    return this.pressedKey.has(key);
  }

  press(key: string, event: KeyboardEvent) {
    this.pressedKey.set(key, event);
  }

  release(key: string) {
    this.pressedKey.delete(key);
  }

  stop() {
    this.pressedKey.clear();
    this.target.removeEventListener(
      "keydown",
      this.handleKeyDown.bind(this) as EventListener,
    );
    this.target.removeEventListener(
      "keyup",
      this.handleKeyUp.bind(this) as EventListener,
    );
  }
}
