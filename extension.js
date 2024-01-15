const vscode = require('vscode');
const Client = require('./lib/client.js');


function activate(context) {
  console.log('Congratulations, your extension "htmlclasses-parser" is now active!');

  const disposable = vscode.commands.registerCommand('htmlclasses-parser.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from htmlClasses-parser!');
  });

  const test = vscode.commands.registerCommand('htmlclasses-parser.test', () => {
    const window = vscode.window;
    const client = new Client(window);

    const classes = client.convert();
    client.print(classes.toString());
  });
  context.subscriptions.push(disposable, test);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
