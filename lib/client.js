const htmlparser2 = require('htmlparser2');
const vscode = require('vscode');

class Client {
  #window;
  #editor;
  #document;

  /** @param {typeof import("vscode").window} window */
  constructor(window) {
    if (window === null) return;
    this.#window = window;
    this.#editor = window.activeTextEditor;
    this.#document = this.#editor.document;
  }

  #highlighted() {
    const highlighted = this.#editor.selection;
    const start = highlighted.start.line;
    const end = highlighted.end.line;
    if (start === end) return this.#document.getText();
    const selectionRange = new vscode.Range(start, 0, end, 1000);
    return this.#document.getText(selectionRange);
  }

  /** @param {string} message */
  print(message) {
    if (message === null) return;
    this.#window.showInformationMessage(message);
  }

  // convertBEM() {
  //   try {
  //     const classesStream = this.#convert();
  //   } catch (err) {
  //     return void console.log(err);
  //   }

  // }

  // converCSS() {
  //   try {
  //     this.#convert();
  //   } catch (err) {
  //     return void console.log(err);
  //   }
  // }

  convert() {
    const highlighted = this.#highlighted();
    console.log(highlighted);
    // const readable = stream.Readable.from(this.#highlighted());
    const classes = new Set();
    const parser = new htmlparser2.Parser({
      onattribute(attribute, value) {
        if (attribute === 'class' || attribute === 'className') {
          for (const className of value.split(' ')) {
            const trimmedClass = className.trim();
            if (trimmedClass === '') return;
            return void classes.add(`.${trimmedClass} {\n}`);
          }
        }
      },
    });
    parser.write(highlighted);
    vscode.env.clipboard.writeText([...classes.values()].join('\n'));
    this.print('Classes are copied to the clipboard');
  }
}

module.exports = Client;
