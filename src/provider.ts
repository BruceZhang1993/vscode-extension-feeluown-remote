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
                                vscode.TreeItemCollapsibleState.None
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

	contextValue = 'track';
}