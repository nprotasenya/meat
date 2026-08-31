import { EventEmitter } from './EventEmitter.js';

/**
 * Корзина. Знає лише про товари/кількості/суму та про те,
 * що після кожної зміни треба зберегтись і сповістити підписників.
 * Нічого не знає про DOM чи WhatsApp (SRP).
 */
export class Cart extends EventEmitter {
  /** @param {import('./CartStorage.js').CartStorage} storage */
  constructor(storage) {
    super();
    this.storage = storage;
    /** @type {Map<string, {product: import('./Product.js').Product, qty: number}>} */
    this.items = new Map();
    this.#restore();
  }

  #restore() {
    const saved = this.storage.load();
    saved.forEach(({ product, qty }) => {
      this.items.set(product.id, { product, qty });
    });
  }

  #persistAndNotify() {
    const plain = this.getItems().map(({ product, qty }) => ({ product, qty }));
    this.storage.save(plain);
    this.emit('change', this.getItems());
  }

  add(product, qty = 1) {
    const existing = this.items.get(product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      this.items.set(product.id, { product, qty });
    }
    this.#persistAndNotify();
  }

  remove(productId) {
    this.items.delete(productId);
    this.#persistAndNotify();
  }

  updateQty(productId, qty) {
    const entry = this.items.get(productId);
    if (!entry) return;
    if (qty <= 0) {
      this.remove(productId);
      return;
    }
    entry.qty = qty;
    this.#persistAndNotify();
  }

  clear() {
    this.items.clear();
    this.storage.clear();
    this.emit('change', this.getItems());
  }

  getItems() {
    return [...this.items.values()];
  }

  getCount() {
    return this.getItems().reduce((sum, { qty }) => sum + qty, 0);
  }

  getTotal() {
    return this.getItems().reduce((sum, { product, qty }) => sum + product.price * qty, 0);
  }
}
