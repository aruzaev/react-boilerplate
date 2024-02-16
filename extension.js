// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Create a new status bar item that will be shown in the left part of the status bar
  const myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );

  // Set text to be shown in the status bar
  myStatusBarItem.text = `$(react) React Boilerplate Ready`;

  // Set a tooltip that will be shown when hovering over the status bar item
  myStatusBarItem.tooltip = "React Boilerplate Extension is Active";

  // Make the status bar item visible
  myStatusBarItem.show();

  // Add to context subscriptions to ensure proper disposal
  context.subscriptions.push(myStatusBarItem);

  let disposable = vscode.commands.registerCommand(
    "react-boilerplate.Insert: Boilerplate",
    function () {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showInformationMessage(
          "Open a JavaScript file to insert the React boilerplate."
        );
        return; // Exit if no document is open
      }
      const uri = activeEditor.document.uri;
      insertBoilerplateCode(uri); // Now uri is defined
    }
  );
  const watcher = vscode.workspace.createFileSystemWatcher("**/src/**/*.js");

  watcher.onDidCreate((uri) => {
    console.log("New js file has been created");
    insertBoilerplateCode(uri); // Call your function to insert boilerplate code
  });

  context.subscriptions.push(watcher);
}

function insertBoilerplateCode(uri) {
  const componentName = capitalizeFirstLetter(
    uri.path.match(/[^/]+(?=\.js$)/)[0]
  );

  const boilerplate = `import React from 'react';
  
  function ${componentName}() {
	return (
	  <div>
	  </div>
	);
  }
  
  export default ${componentName};
  `;

  vscode.workspace.openTextDocument(uri).then((document) => {
    const edit = new vscode.WorkspaceEdit();
    edit.insert(uri, new vscode.Position(0, 0), boilerplate);
    vscode.workspace.applyEdit(edit).then((success) => {
      if (success) {
        vscode.window.showTextDocument(document);
      } else {
        console.log("Failed to insert boilerplate code.");
      }
    });
  });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
