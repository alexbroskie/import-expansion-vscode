import * as vscode from 'vscode';

const kNilKey = "nil";

function log(logText: string) {
    vscode.window.showInformationMessage(logText);
}

function errorLog(logText : string) {
    vscode.window.showErrorMessage(logText);
}

function warnLog(logText : string) {
    vscode.window.showWarningMessage(logText);
}

export function activate(context: vscode.ExtensionContext) {
	console.log('"import-extension" is now active!');

	const disposable = vscode.commands.registerCommand('import-extension.import', async () => {
		const userInput = await vscode.window.showInputBox({
            placeHolder: `import-command import-operators (or ${kNilKey} for nothing) include-semicolon (true/false) library1 library2...`,
            prompt: "Enter libraries to import"
        });

        if (!userInput || userInput === "") {  log("Import cancelled!"); return; } //User didn't input anything

        const args = userInput.split(" ");

        if (args.length < 3) {
            errorLog("Insufficient number of arguments!"); return;
        } else if (args[1].length !== 2 && args[1] !== kNilKey) {
            errorLog("Only 1 character length import operators supported! Example: <> or ''"); return;
        } else if (args[2] !== "true" && args[2] !== "false") {
            errorLog("Only 'true' or 'false' is allowed as third argument!"); return;
        }

        const importCommand = args[0];
        const leftOperator = args[1] === kNilKey ? "" : args[1][0];
        const rightOperator = args[1] === kNilKey ? "" : args[1][1];
        const semicolon = args[2] === "true" ? ";" : "";

        const libArr = args.slice(3).sort();
        let textToInsert = "";

        libArr.forEach((lib, i) => {
            textToInsert += "\n" + importCommand + " " + leftOperator + lib + rightOperator + semicolon;
            if (i === 0) { textToInsert = textToInsert.slice(1); }
        });

        textToInsert += "\n\n";

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            errorLog("No code is opened right now!");
            return;
        }

        await editor.edit((editBuilder) => {
            editBuilder.insert(new vscode.Position(0, 0), textToInsert);
        });

        log("Successfully inserted new imports!");
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {
    console.log('"import-extension" is now unactive!');
}
