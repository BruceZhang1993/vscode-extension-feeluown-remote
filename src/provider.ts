import * as vscode from 'vscode';
import cp = require('child_process');

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
            cp.exec('fuo list', (err: any, stdout: string, stderr: any) => {
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
        new Playlist('本地收藏', undefined, vscode.TreeItemCollapsibleState.Expanded, null),
        new Playlist('网易云音乐', undefined, vscode.TreeItemCollapsibleState.Expanded, null),
        new Playlist('虾米音乐', undefined, vscode.TreeItemCollapsibleState.Expanded, null),
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
        vscode.window.showInformationMessage('This function has not been implemented.');
    }

    private async getPlaylistTree(element: Playlist): Promise<Playlist[]> {
        return new Promise(async resolve => {
            let scriptPath: string = __dirname + "/scripts/playlist.py";
            cp.exec(`fuo exec < ${scriptPath}`, (err: any, stdout: string, stderr: any) => {
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
                                vscode.TreeItemCollapsibleState.None,
                                element
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

    getChildren(element?: Playlist | undefined): vscode.ProviderResult<Playlist[]> {
        if (!element) {
            // 根节点返回 provider 列表
            return this.providers;
        } else {
            return Promise.resolve(this.getPlaylistTree(element));
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
        public readonly parent: Playlist | null
    ) {
        super(name, collapsibleState);
        if (this.parent) {
            this.contextValue = 'playlist_tracks';
        } else {
            this.contextValue = 'playlist_providers';
        }
    }

    get tooltip(): string {
        return `${this.name}`;
    }

    get description(): string | undefined {
        return this.fuo;
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
	}

	get tooltip(): string {
		return `${this.name}`;
	}

	get description(): string {
		return this.fuo;
    }

    startPlay(): void {
        if (this.fuo) {
            cp.exec('fuo play ' + this.fuo, (err: any, stdout: string, stderr: any) => {
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
