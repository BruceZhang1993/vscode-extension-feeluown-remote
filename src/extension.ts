// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { status, toggle, updateConfig, prev, next, init, playTrack, disconnectSocket } from './service';
import { CurrentPlayingProvider, PlaylistsProvider, Playlist } from './provider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let configWatcher = vscode.workspace.onDidChangeConfiguration(updateConfig);

	let cPlayingProvider = new CurrentPlayingProvider(vscode.workspace.rootPath);
	let myPlaylistsProvider = new PlaylistsProvider(vscode.workspace.rootPath);
	vscode.window.registerTreeDataProvider('currentPlaying', cPlayingProvider);
	vscode.window.registerTreeDataProvider('playlist', myPlaylistsProvider);

	// Autostart
	let autostart: boolean | undefined = vscode.workspace.getConfiguration('feeluown').get('autostart');
	console.log(autostart);
	if (autostart) {
		init();
		status();
	}

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
		}),
		playTrack: vscode.commands.registerCommand('feeluown.playTrack', (uri: string, name?: string) => {
			playTrack(uri, name);
		}),
		refreshCurrentPlaying: vscode.commands.registerCommand('feeluown.refreshCurrentPlaying', () => {
			cPlayingProvider.refresh();
		}),
		refreshPlaylist: vscode.commands.registerCommand('feeluown.refreshPlaylist', () => {
			myPlaylistsProvider.refresh();
		}),
		playall: vscode.commands.registerCommand('feeluown.playall', (node: Playlist) => {
			myPlaylistsProvider.playall(node);
		})
	};

	context.subscriptions.concat(Object.values(commandRegister));
	context.subscriptions.push(configWatcher);
}

// this method is called when your extension is deactivated
export function deactivate() {
	disconnectSocket();
}
