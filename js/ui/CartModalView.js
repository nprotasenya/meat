/**
 * Вся логіка модалки корзини: відкрити/закрити, відрендерити позиції,
 * зібрати дані форми, показати "Дякуємо". Не знає, ЯК саме відправляється
 * замовлення — це робота OrderService, ми лише викликаємо колбек.
 */
export class CartModalView {
  #els;

  constructor({
    modalEl,
    openBtnEl,
    closeBtnEl,
    itemsEl,
    totalEl,
    formEl,
    submitBtnEl,
    stateEls, // { cart: HTMLElement, thanks: HTMLElement }
    onQtyChange,
    onRemove,
    onSubmit,
  }) {
    this.#els = { modalEl, openBtnEl, closeBtnEl, itemsEl, totalEl, formEl, submitBtnEl, stateEls };
    this.onQtyChange = onQtyChange;
    this.onRemove = onRemove;
    this.onSubmit = onSubmit;

    this.#bindEvents();
  }

  #bindEvents() {
    const { openBtnEl, closeBtnEl, modalEl, itemsEl, formEl } = this.#els;

    openBtnEl.addEventListener('click', () => this.open());
    closeBtnEl.addEventListener('click', () => this.close());
    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl) this.close(); // клік по бекдропу
    });

    itemsEl.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-remove]');
      if (removeBtn) this.onRemove(removeBtn.dataset.remove);
    });

    itemsEl.addEventListener('change', (e) => {
      const qtyInput = e.target.closest('[data-qty]');
      if (qtyInput) this.onQtyChange(qtyInput.dataset.qty, Number(qtyInput.value));
    });

    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(formEl);
      this.onSubmit({
        name: formData.get('name'),
        phone: formData.get('phone'),
        comment: formData.get('comment'),
      });
    });
  }

  open() {
    this.#els.modalEl.classList.add('is-open');
    this.#showState('cart');
  }

  close() {
    this.#els.modalEl.classList.remove('is-open');
  }

  #showState(name) {
    const { stateEls } = this.#els;
    Object.entries(stateEls).forEach(([key, el]) => {
      el.classList.toggle('is-visible', key === name);
    });
  }

  renderItems(cartItems, currency) {
    const { itemsEl, totalEl, submitBtnEl } = this.#els;

    if (cartItems.length === 0) {
      itemsEl.innerHTML = `<p class="cart-empty">Кошик порожній</p>`;
      totalEl.textContent = `0 ${currency}`;
      submitBtnEl.disabled = true;
      return;
    }

    itemsEl.innerHTML = cartItems
      .map(
        ({ product, qty }) => `
        <div class="cart-item">
          <img class="cart-item__image" src="${product.image}" alt="${product.name}">
          <div class="cart-item__info">
            <p class="cart-item__name">${product.name}</p>
            <p class="cart-item__price">${product.formattedPrice} ${currency}</p>
          </div>
          <input class="cart-item__qty" type="number" min="1" value="${qty}" data-qty="${product.id}">
          <button class="cart-item__remove" data-remove="${product.id}" aria-label="Видалити">✕</button>
        </div>`
      )
      .join('');

    const total = cartItems.reduce((sum, { product, qty }) => sum + product.price * qty, 0);
    totalEl.textContent = `${total.toLocaleString('uk-UA')} ${currency}`;
    submitBtnEl.disabled = false;
  }

  setSubmitting(isSubmitting) {
    this.#els.submitBtnEl.disabled = isSubmitting;
    this.#els.submitBtnEl.textContent = isSubmitting ? 'Надсилаємо…' : 'Надіслати замовлення';
  }

  showThankYou() {
    this.#showState('thanks');
    this.#els.formEl.reset();
  }

  showError(message) {
    alert(message); // просто і надійно; за бажанням заміниш на toast-компонент
  }
}
