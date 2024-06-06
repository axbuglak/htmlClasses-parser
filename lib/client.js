const htmlparser2 = require('htmlparser2');
const vscode = require('vscode');

class Client {
  /** @param {typeof import("vscode").window} window */
  constructor(window) {
    if (window === null) return;
    this.window = window;
    this.editor = window.activeTextEditor;
    this.document = this.editor.document;
  }

  highlighted() {
    const highlighted = this.editor.selection;
    const start = highlighted.start.line;
    const end = highlighted.end.line;
    if (start === end) return this.document.getText();
    const selectionRange = new vscode.Range(start, 0, end, 1000);
    return this.document.getText(selectionRange);
  }

  print(message) {
    if (typeof message !== 'string') return;
    this.window.showInformationMessage(message);
  }

  copy(message) {
    if (typeof message !== 'string') return;
    vscode.env.clipboard.writeText(message);
  }

  convertBEM() {
    const classes = {};
    const splitClasses = (className) => {};
    this.handleClasses(splitClasses);
  }

  convertCSS() {
    const classes = new Set();
    this.handleClasses((className) => classes.add(`.${className} {\n}`));
    this.copy([...classes.values()].join('\n'));
    this.print('Classes are copied to the clipboard');
  }

  handleClasses(cb) {
    const highlighted = this.highlighted();
    // const readable = stream.Readable.from(this.highlighted());
    const handlers = {
      onattribute(attribute, value) {
        if (attribute === 'class' || attribute === 'className') {
          for (const className of value.split(' ')) {
            const trimmedClass = className.trim();
            if (trimmedClass === '') continue;
            cb(trimmedClass);
          }
        }
      },
    };
    const parser = new htmlparser2.Parser(handlers);
    parser.write(highlighted);
  }
}

module.exports = Client;
