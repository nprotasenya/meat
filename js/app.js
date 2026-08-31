import { CONFIG } from './config/app.config.js';
import { Cart } from './core/Cart.js';
import { LocalStorageCartStorage } from './core/CartStorage.js';
import { ProductService } from './services/ProductService.js';
import { OrderService } from './services/OrderService.js';
import { ProductListView } from './ui/ProductListView.js';
import { CartModalView } from './ui/CartModalView.js';
import { CartBadgeView } from './ui/CartBadgeView.js';

/**
 * Composition root: єдине місце, де ми створюємо конкретні реалізації
 * і "зшиваємо" їх докупи. Якщо завтра Cart зберігатиметься не в
 * localStorage, а продукти прийдуть з API — міняємо тільки тут.
 */
class App {
  constructor() {
    this.productService = new ProductService();
    this.cart = new Cart(new LocalStorageCartStorage(CONFIG.CART_STORAGE_KEY));
    this.orderService = new OrderService(CONFIG.ORDER_API_URL);

    this.productListView = new ProductListView(
      document.querySelector('#product-list'),
      (productId) => this.#handleAddToCart(productId)
    );

    this.cartBadgeView = new CartBadgeView(document.querySelector('#cart-count'));

    this.cartModalView = new CartModalView({
      modalEl: document.querySelector('#cart-modal'),
      openBtnEl: document.querySelector('#open-cart'),
      closeBtnEl: document.querySelector('#close-cart'),
      itemsEl: document.querySelector('#cart-items'),
      totalEl: document.querySelector('#cart-total'),
      formEl: document.querySelector('#order-form'),
      submitBtnEl: document.querySelector('#submit-order'),
      stateEls: {
        cart: document.querySelector('#cart-state-default'),
        thanks: document.querySelector('#cart-state-thanks'),
      },
      onQtyChange: (id, qty) => this.cart.updateQty(id, qty),
      onRemove: (id) => this.cart.remove(id),
      onSubmit: (customer) => this.#handleOrderSubmit(customer),
    });

    this.cart.on('change', (items) => {
      this.cartModalView.renderItems(items, CONFIG.CURRENCY);
      this.cartBadgeView.update(this.cart.getCount());
    });
  }

  async init() {
    try {
      this.products = await this.productService.getAll();
      this.productListView.render(this.products, CONFIG.CURRENCY);
      this.cartModalView.renderItems(this.cart.getItems(), CONFIG.CURRENCY);
      this.cartBadgeView.update(this.cart.getCount());
    } catch (err) {
      console.error(err);
      document.querySelector('#product-list').innerHTML =
        '<p class="error">Не вдалося завантажити товари. Оновіть сторінку.</p>';
    }
  }

  #handleAddToCart(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (product) this.cart.add(product);
  }

  async #handleOrderSubmit(customer) {
    if (!customer.name || !customer.phone) {
      this.cartModalView.showError('Вкажіть імʼя та телефон для звʼязку.');
      return;
    }

    this.cartModalView.setSubmitting(true);
    try {
      await this.orderService.submit(customer, this.cart.getItems());
      this.cart.clear();
      this.cartModalView.showThankYou();
    } catch (err) {
      this.cartModalView.showError(err.message);
    } finally {
      this.cartModalView.setSubmitting(false);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App().init();
});
