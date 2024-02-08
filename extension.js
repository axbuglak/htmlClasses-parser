const vscode = require('vscode');
const Client = require('./lib/client.js');

function activate(context) {
  const window = vscode.window;
  const client = new Client(window);

  const run = vscode.commands.registerCommand('htmlclasses-parser.run', () => {
    const fileType = window.activeTextEditor?.document.fileName;
    if (!fileType.endsWith('html') && !fileType.endsWith('jsx') &&
     !fileType.endsWith('tsx') && !fileType.endsWith('vue')) return;
    client.convert();
  });
  context.subscriptions.push(run);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
