/**
 * Абстракція сховища корзини. Cart залежить від ЦЬОГО інтерфейсу,
 * а не від localStorage напряму (DIP) — завтра можна підмінити на
 * sessionStorage / IndexedDB / API, не чіпаючи Cart.
 */
export class CartStorage {
  load() {
    throw new Error('load() must be implemented');
  }
  save(_items) {
    throw new Error('save() must be implemented');
  }
  clear() {
    throw new Error('clear() must be implemented');
  }
}

export class LocalStorageCartStorage extends CartStorage {
  constructor(storageKey) {
    super();
    this.storageKey = storageKey;
  }

  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  save(items) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  clear() {
    localStorage.removeItem(this.storageKey);
  }
}
