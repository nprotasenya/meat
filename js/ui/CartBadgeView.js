/** Одна маленька відповідальність: показати число товарів на іконці кошика. */
export class CartBadgeView {
  constructor(badgeEl) {
    this.badgeEl = badgeEl;
  }

  update(count) {
    this.badgeEl.textContent = count;
    this.badgeEl.classList.toggle('is-visible', count > 0);
  }
}
