/**
 * Відповідає лише за рендер сітки товарів, згрупованих за категорією,
 * і делегування кліку "Додати в корзину" назовні через колбек
 * (Cart сюди не імпортуємо — View не повинен знати про домен).
 */
export class ProductListView {
  /**
   * @param {HTMLElement} container
   * @param {(productId: string) => void} onAddToCart
   */
  constructor(container, onAddToCart) {
    this.container = container;
    this.onAddToCart = onAddToCart;
    this.container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-add-to-cart]');
      if (btn) this.onAddToCart(btn.dataset.addToCart);
    });
  }

  /** @param {import('../core/Product.js').Product[]} products */
  render(products, currency) {
    const groups = this.#groupByCategory(products);

    this.container.innerHTML = Object.entries(groups)
      .map(
        ([category, items]) => `
        <section class="category-section">
          <div class="category-section__title-with-background">
            <h2 class="category-section__title">${category}</h2>
            <div class="${category}-bg"></div>
          </div>
          <div class="product-grid">
            ${items.map((p) => this.#renderCard(p, currency)).join('')}
          </div>
        </section>`
      )
      .join('');
  }

  #groupByCategory(products) {
    return products.reduce((groups, product) => {
      (groups[product.category] ??= []).push(product);
      return groups;
    }, {});
  }

  #renderCard(p, currency) {
    const imageMarkup = p.image
      ? `<div class="product-card__image" style="background-image:url('${p.image}')"></div>`
      : `<div class="product-card__image product-card__image--placeholder">🔥</div>`;

    // Fit this after desc.
    var tagMarkup = "";
    if(p.tags)
    {
      p.tags.forEach(tag => {
        switch(tag) {
          case "festive": { 
            tagMarkup += "<p class=\"product-card__tag_accent\">Святкове</p>";
            break;
          }
          case "weekend": {
            tagMarkup += "<p class=\"product-card__tag\">На вихідних</p>";
            break;
          }
        }
      });
    }

    return `
      <article class="product-card">
        ${imageMarkup}
        <div class="product-card__body">
          <h3 class="product-card__name">${p.name}</h3>
          <p class="product-card__desc">${p.description}</p>
          <div class="">
            ${tagMarkup}
          </div>
          <div class="product-card__footer">
            <span class="product-card__price">${p.formattedPrice} ${currency} / ${p.unit}</span>
            <button class="btn btn--primary" data-add-to-cart="${p.id}">У кошик</button>
          </div>
        </div>
      </article>`;
  }
}
