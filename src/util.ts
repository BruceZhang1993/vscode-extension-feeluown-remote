import cp = require('child_process');
import os = require('os');

export function formatSeconds(value: number) {
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
	var result = '' + (secondTime >= 10 ? secondTime : '0' + secondTime);

	result = '' + (minuteTime >= 10 ? minuteTime : '0' + minuteTime) + ':' + result;

	if(hourTime > 0) {
		result = '' + (hourTime >= 10 ? hourTime : '0' + hourTime) + ':' + result;
	}
	return result;
}

export function runCommand(command: string, callback?: (err: cp.ExecException | null, stdout: string, stderr: string) => void) {
	cp.exec(command, {encoding: 'buffer'}, (err: cp.ExecException | null, stdout: string|Buffer, stderr: string|Buffer) => {
		if (!callback) { return; }
		if (os.platform() === 'win32') {
			let iconv = require('iconv-lite');
			iconv.decode(stdout, 'gbk');
			stdout = iconv.decode(stdout, 'gbk');
			stderr = iconv.decode(stderr, 'gbk');
		}
		callback(err, stdout.toString(), stderr.toString());
	});
}
