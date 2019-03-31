import * as vscode from 'vscode';
import cp = require('child_process');
import { formatSeconds } from './util';

let statusBarName: vscode.StatusBarItem;
let statusBarLrc: vscode.StatusBarItem;
let statusBarToggle: vscode.StatusBarItem;

export function init() {
	// Current lyric
	statusBarLrc = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 121);
	// Track name
	statusBarName = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 120);
	// Toggle play
	statusBarToggle = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 108);

	statusBarToggle.text = ' ⏸️ ';
	statusBarToggle.command = 'feeluown.toggle';
	statusBarToggle.tooltip = '暂停播放';
	statusBarToggle.show();
}

export function toggle() {
	cp.exec('fuo toggle', (err: any, stdout: string, stderr: any) => {
		if (!err) {
			// statusBarToggle.text = '  ';
			// statusBarToggle.tooltip = '开始播放';
		} else {
			vscode.window.showErrorMessage('fuo is not available.');
		}
	});
}

export function status() {
	cp.exec('fuo status', (err: any, stdout: string, stderr: any) => {
		if (!err) {
			let status = stdout.split("\n");
			let song: string = '';
			let position: number = 0;
			let duration: number = 0;
			let lyric: string = '';
			let playState: string = '';
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
				if (line.indexOf('state:') !== -1) {
					playState = line.replace('state:', '').trim();
				}
			});
			if (song) {
				console.log(lyric);
				statusBarName.text = song + '(' + formatSeconds(position) + '/' + formatSeconds(duration) + ')';
				statusBarName.show();
				statusBarLrc.text = lyric;
				statusBarLrc.show();

				if (playState === 'playing') {
					statusBarToggle.text = ' ⏸️ ';
					statusBarToggle.tooltip = '暂停播放';
				} else {
					statusBarToggle.text = ' 🎵️ ';
					statusBarToggle.tooltip = '开始播放';
				}
			}
		} else {
			statusBarName.hide();
			statusBarLrc.hide();
			console.log(err);
			console.log(stderr);
			vscode.window.showErrorMessage('fuo is not available.');
		}
		setTimeout(status, 800);
	});
}