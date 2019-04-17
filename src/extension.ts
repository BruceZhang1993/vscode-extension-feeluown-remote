// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { status, toggle, updateConfig, prev, next, init } from './service';
import { CurrentPlayingProvider } from './provider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let configWatcher = vscode.workspace.onDidChangeConfiguration(updateConfig);

	let commandRegister = {
		status: vscode.commands.registerCommand('feeluown.start', () => {
			init();
			status();
		}),
		toggle: vscode.commands.registerCommand('feeluown.toggle', () => {
			toggle();
		}),
		prev: vscode.commands.registerCommand('feeluown.prev', () => {
			prev();
		}),
		next: vscode.commands.registerCommand('feeluown.next', () => {
			next();
		})
	};

	let cPlayingProvider = new CurrentPlayingProvider(vscode.workspace.rootPath);
	vscode.window.registerTreeDataProvider("currentPlaying", cPlayingProvider);

	context.subscriptions.concat(Object.values(commandRegister));
	context.subscriptions.push(configWatcher);
}

// this method is called when your extension is deactivated
export function deactivate() {}
