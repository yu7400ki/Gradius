export class KeyState {
  pressedKey = new Map<string, KeyboardEvent>();
  target: HTMLElement | (Window & typeof globalThis);

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
  }

  private handleKeyUp(event: KeyboardEvent) {
    this.release(event.key);
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
