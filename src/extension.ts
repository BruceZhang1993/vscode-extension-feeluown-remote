// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { status, init } from './service';

let statusBarName: vscode.StatusBarItem;
let statusBarLrc: vscode.StatusBarItem;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	init();

	let disposable = vscode.commands.registerCommand('extension.feeluownStart', () => {
		status();
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
