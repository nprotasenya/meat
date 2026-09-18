/**
 * Відповідає за рендер навігації по категоріях.
 */

export class CategoryNavigationView {
  /**
   * @param {HTMLElement} container
   * @param {(categoryId: string) => void} onCatClick
   */
  constructor(container, catClick) {
    this.container = container;
    this.onCatClick = catClick;
  }

  /** @param {import('../core/Product.js').Product[]} products */
  render(products) {
    const groups = this.#groupByCategory(products);
    this.container.innerHTML = Object.entries(groups)
    .map(
        ([category, items]) => `
        <div class="navigation__title_with_icon" data-category="${category.replace(/'/g, '').replace(/ /g, '-').replace(/\./g, '')}">
            <img class="navigation__icon" src="./assets/img/categories/${category}-nav.png"/>
            <h2 class="category-section__title">${category}</h2>
        </div>`
    )
    .join('');

    for(var index = 0; index < this.container.children.length; index++) {
        this.container.children[index].addEventListener('click', 
            (e)=>{
                this.onCatClick(e.target.closest("[data-category]").dataset.category)
            });
    }
  }

  #groupByCategory(products) {
    return products.reduce((groups, product) => {
      (groups[product.category] ??= []).push(product);
      return groups;
    }, {});
  }
}