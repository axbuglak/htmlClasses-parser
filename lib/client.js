class Client {
  #window;
  #editor;
  #document;
  highlighted;

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

  print(message) {
    if (message === null) return;
    this.#window.showInformationMessage(message);
  }

  convert() {
    this.copy();
    const results = [];
    const REGEX = /("((?:\\.|[^"\\])*)")/g;
    const classes = this.highlighted.match(REGEX);
    for (const className of classes) results.push(className.slice(1, -1));
    // separate the classes if they are written with space (class="class1 class2")
    // classes can be written with single quotes
    return results;
  }
}


module.exports = Client;
