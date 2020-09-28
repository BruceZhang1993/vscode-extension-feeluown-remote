import * as vscode from 'vscode';
import { readFile } from 'fs';
import { runCommand } from './util';
import { ExecException } from 'child_process';

export class CurrentPlayingProvider implements vscode.TreeDataProvider<Track> {

    private _onDidChangeTreeData: vscode.EventEmitter<Track | undefined> = new vscode.EventEmitter<Track | undefined>();
    readonly onDidChangeTreeData: vscode.Event<Track | undefined> = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string | undefined) {
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    private async getList(): Promise<Track[]> {
        return new Promise(async resolve => {
            runCommand('fuo list', (err: ExecException | null, stdout: string, stderr: string) => {
                if (!err) {
                    let trackList: string[] = stdout.split("\n");
                    let itemList: Track[] = [];
                    trackList.forEach(element => {
                        if (element.length > 0) {
                            let trackString: string[] = element.split('#');
                            let trackLink: string[] = trackString[0].trim().split(/\s+/);
                            itemList.push(new Track(
                                trackString[1].trim(),
                                trackLink[1].trim(),
                                vscode.TreeItemCollapsibleState.None,
                                {
                                    title: 'FeelUOwn Remote: Play track',
                                    command: 'feeluown.playTrack',
                                    arguments: [trackLink[1].trim(), trackString[1].trim()]
                                }
                            ));
                        }
                    });
                    resolve(itemList);
                } else {
                    vscode.window.showErrorMessage('fuo is not available.');
                    resolve([]);
                }
            });
        });
    }

    getChildren(element?: Track | undefined): vscode.ProviderResult<Track[]> {
        return Promise.resolve(this.getList());
    }

    getTreeItem(element: Track): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
}

export class PlaylistsProvider implements vscode.TreeDataProvider<Playlist> {
    private _onDidChangeTreeData: vscode.EventEmitter<Playlist | undefined> = new vscode.EventEmitter<Playlist | undefined>();
    readonly onDidChangeTreeData: vscode.Event<Playlist | undefined> = this._onDidChangeTreeData.event;
    readonly providers: Playlist[] = [
        new Playlist('本地收藏', undefined, vscode.TreeItemCollapsibleState.Expanded, null, null),
        new Playlist('网易云音乐', undefined, vscode.TreeItemCollapsibleState.Expanded, null, null),
        new Playlist('虾米音乐', undefined, vscode.TreeItemCollapsibleState.Expanded, null, null),
    ];
    readonly providerLabels: any = {
        '本地收藏': 'collection',
        '网易云音乐': 'netease',
        '虾米音乐': 'xiami'
    };

    constructor(private workspaceRoot: string | undefined) {
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    playall(playlist: Playlist | null): void {
        if (playlist?.fuo && playlist?.fuo.startsWith('fuo:')) {
            runCommand(`fuo stop && fuo clear && fuo add ${playlist.fuo} && fuo resume && fuo next`, (err: ExecException | null, stdout: string, stderr: string) => {
                if (err) {
                    vscode.window.showErrorMessage(stderr + ' ' + stdout);
                }
            });
        } else {
            vscode.window.showInformationMessage('Not available.');
        }
    }

    private async getPlaylistTree(element: Playlist): Promise<Playlist[]> {
        return new Promise(async resolve => {
            let scriptPath: string = __dirname + "/scripts/playlist.py";
            runCommand(`fuo exec < ${scriptPath}`, (err: ExecException | null, stdout: string, stderr: string) => {
                if (!err) {
                    let lines: string[] = stdout.split("\n");
                    let itemList: Playlist[] = [];
                    lines.forEach((line: string) => {
                        let segments: string[] = line.split('$$$');
                        let label: string = this.providerLabels[element.name];
                        if (segments[0] === label) {
                            itemList.push(new Playlist(
                                segments[2],
                                segments[3],
                                vscode.TreeItemCollapsibleState.Collapsed,
                                element,
                                'playlist_list'
                            ));
                        }
                    });
                    resolve(itemList);
                } else {
                    vscode.window.showErrorMessage('fuo is not available.');
                    resolve([]);
                }
            });
        });
    }

    private async getPlaylistTracks(element: Playlist): Promise<Playlist[]> {
        return new Promise(async resolve => {
            if (element.name === '我的收藏' && !element.fuo) {
                // 虾米我的收藏歌曲
                let scriptPath: string = __dirname + "/scripts/fav_songs.py";
                runCommand(`fuo exec < ${scriptPath}`, (err: ExecException | null, stdout: string, stderr: string) => {
                    if (!err) {
                        let lines: string[] = stdout.split("\n");
                        let itemList: Playlist[] = [];
                        lines.forEach((line: string) => {
                            let segments: string[] = line.split('$$$');
                            if (segments.length > 0) {
                                itemList.push(new Playlist(
                                    segments[0],
                                    segments[1],
                                    vscode.TreeItemCollapsibleState.None,
                                    element,
                                    'playlist_tracks',
                                    {
                                        title: 'FeelUOwn Remote: Play track',
                                        command: 'feeluown.playTrack',
                                        arguments: [segments[1], segments[0]]
                                    }
                                ));
                            }
                        });
                        resolve(itemList);
                    } else {
                        vscode.window.showErrorMessage('fuo is not available.');
                        resolve([]);
                    }
                });
            } else if (!element.fuo?.startsWith('fuo:')) {
                // 本地收藏
                if (!element.fuo) {
                    resolve([]);
                }
                readFile(element.fuo ?? '', (err: NodeJS.ErrnoException | null, data: Buffer) => {
                    if (err) {
                        resolve([]);
                    } else {
                        let lines: string[] = data.toString().split('\n');
                        let items: Playlist[] = [];
                        lines.forEach((line: string) => {
                            let segments = line.split('#');
                            if (segments.length === 2) {
                                let trackTitle: string = segments[1].replace(/-\s+(\d{2}:)?\d{2}:\d{2}/, '').trim();
                                items.push(new Playlist(
                                    trackTitle,
                                    segments[0].trim(),
                                    vscode.TreeItemCollapsibleState.None,
                                    element,
                                    'playlist_tracks',
                                    {
                                        title: 'FeelUOwn Remote: Play track',
                                        command: 'feeluown.playTrack',
                                        arguments: [segments[0].trim(), trackTitle]
                                    }
                                ));
                            }
                        });
                        resolve(items);
                    }
                });
            } else {
                // 在线歌单
                runCommand(`fuo show ${element.fuo}/songs`, (err: ExecException | null, stdout: string, stderr: string) => {
                    if (!err) {
                        let lines: string[] = stdout.split("\n");
                        let itemList: Playlist[] = [];
                        lines.forEach((line: string) => {
                            let [fuo, name] = line.split('#');
                            if (fuo) {
                                itemList.push(new Playlist(
                                    name.trim(),
                                    fuo.trim(),
                                    vscode.TreeItemCollapsibleState.None,
                                    element,
                                    'playlist_tracks',
                                    {
                                        title: 'FeelUOwn Remote: Play track',
                                        command: 'feeluown.playTrack',
                                        arguments: [fuo.trim(), name.trim()]
                                    }
                                ));
                            }
                        });
                        resolve(itemList);
                    } else {
                        vscode.window.showErrorMessage('fuo is not available.');
                        resolve([]);
                    }
                });
            }
        });
    }

    getChildren(element?: Playlist | undefined): vscode.ProviderResult<Playlist[]> {
        if (!element) {
            // 根节点返回 provider 列表
            return this.providers;
        } else if (element.contextValue === 'playlist_providers') {
            // 返回 playlists
            return Promise.resolve(this.getPlaylistTree(element));
        } else if (element.contextValue === 'playlist_list') {
            // 返回 tracks
            return Promise.resolve(this.getPlaylistTracks(element));
        }
    }

    getTreeItem(element: Playlist): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
}

export class Playlist extends vscode.TreeItem {
    constructor(
        public readonly name: string,
        public readonly fuo: string | undefined,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly parent: Playlist | null,
        public readonly context: string | null,
        public readonly command?: vscode.Command
    ) {
        super(name, collapsibleState);
        if (this.parent) {
            this.contextValue = 'playlist';
        } else {
            this.contextValue = 'playlist_providers';
        }
        if (context) {
            this.contextValue = context;
        }
        this.tooltip = this.name;
        this.description = this.fuo;
    }
}

export class Track extends vscode.TreeItem {
    constructor(
        public readonly name: string,
        public readonly fuo: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
        super(name, collapsibleState);
        this.tooltip = this.name;
        this.description = this.fuo;
	}

    startPlay(): void {
        if (this.fuo) {
            runCommand('fuo play ' + this.fuo, (err: ExecException | null, stdout: string, stderr: string) => {
                if (!err) {
                    vscode.window.showInformationMessage('Current playing: ' + this.name);
                } else {
                    vscode.window.showErrorMessage('fuo is not available.');
                }
            });
        } else {
            vscode.window.showErrorMessage('Something wrong.');
        }
    }

	contextValue = 'track';
}
