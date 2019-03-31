import * as vscode from 'vscode';
import cp = require('child_process');
import { formatSeconds } from './util';

let statusBarName: vscode.StatusBarItem;
let statusBarLrc: vscode.StatusBarItem;

export function init() {
    statusBarName = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarLrc = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 101);
}

export function status() {
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