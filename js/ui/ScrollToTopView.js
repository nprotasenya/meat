/**
 * Відповідає за рендер навігації по категоріях.
 */

export class ScrollToTopView {
  /**
   * @param {HTMLElement} button
   * @param {HTMLElement} navBottom
   * @param {() => void} buttonClick
   */
  constructor(button, container, onClick) {
    this.button = button;
    this.navBottom = container;
    this.buttonClick = onClick;
  }

  init() {
    document.addEventListener("scroll", (e) => {
        var edge = this.navBottom.offsetTop + this.navBottom.offsetHeight;
        console.log("edge = " + edge + " doc scroll = " +document.body.scrollTop);
        if(document.documentElement.scrollTop > edge)
            this.button.classList.add("btt_shown");
        else 
            this.button.classList.remove("btt_shown");
    });

    // Button click event.
    this.button.addEventListener('click', this.buttonClick);
  }


}