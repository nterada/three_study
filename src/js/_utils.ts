const stats = new (require('stats.js'))();
stats.dom.style.opacity = 0.75;
stats.dom.style.pointerEvents = 'none';
document.body.appendChild(stats.dom);

export class Ticker {
  private static _lastUpdated: number = 0;

  static onUpdate(fn: Function) {
    const frameMS = 1000 / 60;
    const update = () => {
      const now = Date.now();
      const elapsed = (now - this._lastUpdated) / frameMS;
      if (elapsed > 0.7) {
        this._lastUpdated = now;
        stats.begin();
        fn();
        Logger.output();
        stats.end();
      }
      window.requestAnimationFrame(update);
    };
    update();
  }
}

export class Logger {
  private static _el: HTMLElement;
  private static _memo: { [label: string]: number | string } = {};

  static add(label: string, value: number | string) {
    this.create();
    this._memo[label] = value;
  }

  static create() {
    if (this._el) return;
    this._el = document.createElement('div');
    this._el.classList.add('js_logger');
    document.body.appendChild(this._el);
  }

  static output() {
    if (!this._el) return;
    const html = Object.keys(this._memo).map((key) => {
      return `${key}: ${this._memo[key]}`;
    }).join('<br>');
    this._el.innerHTML = html;
  }
}
