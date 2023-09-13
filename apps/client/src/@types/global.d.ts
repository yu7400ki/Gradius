import type { Gradius } from "@/gradius";

declare global {
  interface Window {
    gradius?: Gradius;
  }
}
