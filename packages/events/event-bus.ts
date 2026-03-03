import { EventEmitter } from "node:events";
import type { EventMap, EventName } from "@prove.ink/core";

export class EventBus {
  private emitter = new EventEmitter();

  constructor() {
    this.emitter.setMaxListeners(100);
  }

  emit<E extends EventName>(event: E, payload: EventMap[E]): void {
    this.emitter.emit(event, payload);
  }

  on<E extends EventName>(
    event: E,
    handler: (payload: EventMap[E]) => void
  ): void {
    this.emitter.on(event, handler);
  }

  off<E extends EventName>(
    event: E,
    handler: (payload: EventMap[E]) => void
  ): void {
    this.emitter.off(event, handler);
  }

  once<E extends EventName>(
    event: E,
    handler: (payload: EventMap[E]) => void
  ): void {
    this.emitter.once(event, handler);
  }

  removeAllListeners(event?: EventName): void {
    if (event) {
      this.emitter.removeAllListeners(event);
    } else {
      this.emitter.removeAllListeners();
    }
  }
}
