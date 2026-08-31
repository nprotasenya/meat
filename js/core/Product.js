/**
 * Value object товару. Один клас відповідає лише за форму й валідність
 * даних товару (SRP) — нічого про рендер чи корзину тут немає.
 */
export class Product {
  constructor({ id, name, price, image, description, tags, category, unit }) {
    this.id = id;
    this.name = name;
    this.price = Number(price);
    this.image = image ?? null;
    this.description = description ?? '';
    this.tags = tags ?? null; // Це може бути набором текстових тегів навіть в Базі Даних. Наприклад text[][] в Postgres.
    this.category = category ?? 'Інше';
    this.unit = unit ?? 'шт';
  }

  static fromJSON(raw) {
    if (!raw?.id || !raw?.name || Number.isNaN(Number(raw?.price))) {
      throw new Error(`Некоректні дані товару: ${JSON.stringify(raw)}`);
    }
    return new Product(raw);
  }

  get formattedPrice() {
    return `${this.price.toLocaleString('uk-UA')}`;
  }
}
