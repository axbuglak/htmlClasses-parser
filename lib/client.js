const stream = require('node:stream');
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

  async * #highlighted() {
    const highlighted = this.#editor.selection;
    const selectionRange = new vscode.Range(highlighted.start.line, 0, highlighted.end.line, 999);
    const selected = this.#document.getText(selectionRange);
    if (selected.length === 0) yield this.#document.getText();
    yield selected;
  }

  /** @param {string} message */
  print(message) {
    if (message === null) return;
    this.#window.showInformationMessage(message);
  }

  convert() {
    const readable = stream.Readable.from(this.#highlighted());
    const classes = new Set();
    const parser = new htmlparser2.Parser({
      onattribute(attribute, value) {
        if (attribute === 'class' || attribute === 'className') {
          for (const className of value.split(' ')) {
            const trimmedClass = className.trim();
            if (trimmedClass !== '') classes.add(`.${trimmedClass} {\n}`);
          }
        };
      },
    });
    const createTransformStream = () => {
      const options = {
        async transform(chunk, encoding, next) {
          parser.write(chunk.toString());
          next();
        }
      };
      return new stream.Transform(options);
    };
    readable.pipe(createTransformStream()).on('finish', () => {
      createTransformStream().destroy();
      vscode.env.clipboard.writeText([...classes.values()].join('\n'));
      this.print('done');
    });
  }
}

module.exports = Client;
