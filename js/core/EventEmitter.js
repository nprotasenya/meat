/**
 * Мінімальний pub/sub. Будь-який клас, що успадковує EventEmitter,
 * отримує on/off/emit безкоштовно — не дублюємо цю логіку в Cart, App тощо.
 */
export class EventEmitter {
  #listeners = new Map();

  on(event, handler) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, new Set());
    }
    this.#listeners.get(event).add(handler);
    return () => this.off(event, handler); // повертаємо unsubscribe
  }

  off(event, handler) {
    this.#listeners.get(event)?.delete(handler);
  }

  emit(event, payload) {
    this.#listeners.get(event)?.forEach((handler) => handler(payload));
  }
}
