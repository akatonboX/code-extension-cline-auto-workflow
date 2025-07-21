#メモ

## vscodeのスタートアップ時にactivateする。
- package.jsonに下記のように記述。
``` json
  "activationEvents": [
    "onStartupFinished"
  ],
```

## リソースファイルを含める
- resourcesフォルダを作って、リソースファイルを格納
- package.jsonに下記のように記述。
``` json
  "files": [
    "resources/**"
  ],
```
- 例えば下記のように利用
``` typescript
// resourcesフォルダのEmulateEnter.exeを実行する
const exePath = path.join(context.extensionPath, 'resources', 'EmulateEnter.exe');
execFile(exePath, [], (error, stdout, stderr) => {
  if (error) {
    vscode.window.showErrorMessage(`[cline-auto-workflow] エラーが発生しました。 ${error.message}`);
    return;
  }
});
```

# vsce
パッケージ化(.vsix)の作成に必要な```vsce```だが、2025/7時点で```@vscode/vsce```に、移設されていることに留意。
``` 
yarn add --dev @vscode/vsce
```
パッケージの作成は、下記の通り。これは、「vsceパッケージをダウンロードして実行」ではなく、```yarn add --dev @vscode/vsce```によって作成された```node_modules\.bin\vsce.cmd```を実行するという意味であることに留意。
```
npx vsce package 
```

