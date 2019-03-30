// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import cp = require('child_process');

let statusBarName: vscode.StatusBarItem;
let statusBarLrc: vscode.StatusBarItem;

function formatSeconds(value: number) {
	var secondTime = value;// 秒
	var minuteTime = 0;// 分
	var hourTime = 0;// 小时
	if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
		//获取分钟，除以60取整数，得到整数分钟
		minuteTime = Math.floor(secondTime / 60);
		//获取秒数，秒数取佘，得到整数秒数
		secondTime = secondTime % 60;
		//如果分钟大于60，将分钟转换成小时
		if(minuteTime > 60) {
			//获取小时，获取分钟除以60，得到整数小时
			hourTime = Math.floor(minuteTime / 60);
			//获取小时后取佘的分，获取分钟除以60取佘的分
			minuteTime = minuteTime % 60;
		}
	}
	var result = "" + (secondTime >= 10 ? secondTime : '0' + secondTime);

	result = "" + (minuteTime >= 10 ? minuteTime : '0' + minuteTime) + ":" + result;
	
	if(hourTime > 0) {
		result = "" + (hourTime >= 10 ? hourTime : '0' + hourTime) + ":" + result;
	}
	return result;
}

function status() {
	cp.exec('fuo status', (err: any, stdout: string, stderr: any) => {
		if (!err) {
			let status = stdout.split("\n");
			let song: string = '';
			let position: number = 0;
			let duration: number = 0;
			let lyric: string = '';
			status.forEach(line => {
				if (line.indexOf('song:') !== -1) {
					let songArr = line.split('#');
					song = songArr[1].trimLeft();
				}
				if (line.indexOf('position:') !== -1) {
					let dArr = line.split(/\s+/);
					position = parseInt(dArr[1].trimLeft());
				}
				if (line.indexOf('duration:') !== -1) {
					let duArr = line.split(/\s+/);
					duration = parseInt(duArr[1].trimLeft());
				}
				if (line.indexOf('lyric-s:') !== -1) {
					lyric = line.replace('lyric-s:', '').trim();
				}
			});
			if (song) {
				console.log(lyric);
				statusBarName.text = song + '(' + formatSeconds(position) + '/' + formatSeconds(duration) + ')';
				statusBarName.show();
				statusBarLrc.text = lyric;
				statusBarLrc.show();
			}
		} else {
			console.log(err);
			console.log(stderr);
			vscode.window.showErrorMessage('fuo is not available.');
		}
		setTimeout(status, 800);
	});
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	statusBarName = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarLrc = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 101);

	let disposable = vscode.commands.registerCommand('extension.feeluownTest', () => {
		status();
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
