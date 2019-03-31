// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { status, init, toggle } from './service';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	init();

	let statusD = vscode.commands.registerCommand('feeluown.start', () => {
		status();
	});

	let toggleD = vscode.commands.registerCommand('feeluown.toggle', () => {
		toggle();
	});

	context.subscriptions.push(statusD);
	context.subscriptions.push(toggleD);
}

// this method is called when your extension is deactivated
export function deactivate() {}
