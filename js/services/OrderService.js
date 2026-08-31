/**
 * Відповідає лише за одне: сформувати payload замовлення
 * і відправити його на мікросервіс розсилки. Фронтенд НІЧОГО
 * не знає про WhatsApp API, токени чи провайдера — це деталь
 * бекенд-мікросервісу, з яким ми говоримо через простий HTTP-контракт.
 */
export class OrderService {
  /**
   * @param {string} apiUrl - адреса мікросервісу розсилки
   * @param {typeof fetch} httpClient - інʼєкція fetch, щоб легко мокати в тестах
   */
  constructor(apiUrl, httpClient = globalThis.fetch.bind(globalThis)) {
    this.apiUrl = apiUrl;
    this.httpClient = httpClient;
  }

  /**
   * @param {{name: string, phone: string, comment?: string}} customer
   * @param {Array<{product: import('../core/Product.js').Product, qty: number}>} cartItems
   */
  async submit(customer, cartItems) {
    const payload = this.#buildPayload(customer, cartItems);

    const response = await this.httpClient(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      throw new Error(data.message || 'Не вдалося надіслати замовлення. Спробуйте ще раз.');
    }

    return data;
  }

  #buildPayload(customer, cartItems) {
    return {
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        comment: customer.comment?.trim() ?? '',
      },
      items: cartItems.map(({ product, qty }) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        qty,
        subtotal: product.price * qty,
      })),
      total: cartItems.reduce((sum, { product, qty }) => sum + product.price * qty, 0),
      createdAt: new Date().toISOString(),
    };
  }
}
