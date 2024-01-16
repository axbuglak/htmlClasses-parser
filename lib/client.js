class Client {
  #window;
  #editor;
  #document;
  highlighted;

  /** @param {typeof import("vscode").window} window */
  constructor(window) {
    if (window === null) return;
    this.#window = window;
    this.#editor = window.activeTextEditor;
    this.#document = this.#editor.document;
  }

  copy() {
    let highlighted = this.#document.getText(this.#editor.selection);
    if (highlighted.length === 0) highlighted = this.#document.getText();
    this.highlighted = highlighted;
    return this.highlighted;
  }

  /** @param {string} message */
  print(message) {
    if (message === null) return;
    this.#window.showInformationMessage(message);
  }

  convert() {
    this.copy();
    const results = new Set();
    const REGEX = /class="(.*?)"/gm;
    const selected = this.highlighted.match(REGEX);
    for (const quotes of selected) {
      const classes = quotes.split('"')[1].split(' ');
      for (const className of classes) results.add(className.trim());
    };
    return Array.from(results);
  }
}


module.exports = Client;
