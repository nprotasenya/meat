import { Product } from '../core/Product.js';

/**
 * Єдина відповідальність — дістати товари з products.json
 * і віддати їх як масив Product. Звідки саме товари беруться
 * (JSON файл / майбутнє API) — деталь реалізації, прихована тут.
 */
export class ProductService {
  #cache = null;

  async getAll() {
    if (this.#cache) return this.#cache;

    const response = await fetch('./js/data/products.json');
    if (!response.ok) {
      throw new Error('Не вдалося завантажити список товарів');
    }
    const raw = await response.json();
    this.#cache = raw.map(Product.fromJSON);
    return this.#cache;
  }
}
