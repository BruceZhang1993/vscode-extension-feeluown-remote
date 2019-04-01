// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { status, init, toggle, updateConfig, prev, next } from './service';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	init();

	let configWatcher = vscode.workspace.onDidChangeConfiguration(updateConfig);

	let statusD = vscode.commands.registerCommand('feeluown.start', () => {
		status();
	});

	let toggleD = vscode.commands.registerCommand('feeluown.toggle', () => {
		toggle();
	});

	let prevD = vscode.commands.registerCommand('feeluown.prev', () => {
		prev();
	});

	let nextD = vscode.commands.registerCommand('feeluown.next', () => {
		next();
	});

	context.subscriptions.push(statusD);
	context.subscriptions.push(toggleD);
	context.subscriptions.push(prevD);
	context.subscriptions.push(nextD);
	context.subscriptions.push(configWatcher);
}

// this method is called when your extension is deactivated
export function deactivate() {}
