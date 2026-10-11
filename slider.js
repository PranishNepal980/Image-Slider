
class ImageSlider {
  constructor(root) {
    this.root = document.querySelector(root);
    this.images = [...this.root.querySelectorAll('img')];
    this.count = this.images.length;
    this.current = 0;
    this.position = 1;
    this.busy = false;

    this.build();
    this.bind();
    this.render(false);
  }

  slide(img) {
    const figure = document.createElement('figure');
    figure.className = 'slider__slide';
    figure.append(img);
    return figure;
  }

  button(cls, label, text) {
    const btn = document.createElement('button');
    btn.className = cls;
    btn.setAttribute('aria-label', label);
    btn.textContent = text;
    return btn;
  }

  build() {
    const slides = this.images.map((img) => this.slide(img));
    const first = this.slide(this.images[0].cloneNode(true));
    const last = this.slide(this.images[this.count - 1].cloneNode(true));

    this.track = document.createElement('div');
    this.track.className = 'slider__track';
    this.track.append(last, ...slides, first);

    this.prevBtn = this.button('slider__btn slider__btn--prev', 'Previous', '\u2039');
    this.nextBtn = this.button('slider__btn slider__btn--next', 'Next', '\u203A');
    this.dotsBox = document.createElement('div');
    this.dotsBox.className = 'slider__dots';
    this.dots = this.images.map((_, i) => {
      const dot = this.button('slider__dot', `Slide ${i + 1}`, '');
      dot.dataset.index = i;
      this.dotsBox.append(dot);
      return dot;
    });

    this.root.replaceChildren(this.track, this.prevBtn, this.nextBtn, this.dotsBox);
  }
  bind() {
    this.prevBtn.addEventListener('click', () => this.move(this.position - 1));
    this.nextBtn.addEventListener('click', () => this.move(this.position + 1));
    this.dotsBox.addEventListener('click', (e) => {
      if (e.target.dataset.index !== undefined) this.move(Number(e.target.dataset.index) + 1);
    });
    this.track.addEventListener('transitionend', () => this.settle());
  }
  move(target) {
    if (this.busy || target === this.position) return;
    this.busy = true;
    this.position = target;
    this.current = (target - 1 + this.count) % this.count;
    this.render(true);
  }
  settle() {
    if (this.position === 0) this.position = this.count;
    if (this.position === this.count + 1) this.position = 1;
    this.render(false);
    this.busy = false;
  }
  render(animate) {
    this.track.classList.toggle('is-instant', !animate);
    this.track.style.transform = `translateX(${-this.position * 100}%)`;
    if (!animate) this.track.offsetWidth; // force reflow so the jump isn't animated
    this.dots.forEach((dot, i) => dot.classList.toggle('is-active', i === this.current));
  }
}
