// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { execFile } from 'child_process';
import path from 'path';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cline-auto-workflow" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// const disposable = vscode.commands.registerCommand('cline-auto-workflow.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from cline-auto-workflow!');
	// });

	// context.subscriptions.push(disposable);

	if (process.platform !== 'win32') {
		vscode.window.showErrorMessage('This extension can only be used in a Windows environment.');
		return;
	}
	(async () =>{
		//■ルートフォルダの取得と確認
		const rootFolderpath = (() => {
			const workspaceFolders = vscode.workspace.workspaceFolders;
			if (workspaceFolders != null && workspaceFolders.length > 0) {
				// 1つ目のフォルダのパスを取得
				return workspaceFolders[0].uri.fsPath;
			} else {
				return undefined;
			}
		})();
		if(rootFolderpath == null){
			console.log("[cline-auto-workflow] ワークスペースがないので実行しません。");
			return;
		}
		
		//■アクティブなエディタの内容で処理判断を行い、処理対象の場合は内容を解析して、ワークフロー名を返す。
		const [editor, workflowName] = (() => {
			const editor = vscode.window.activeTextEditor;
			if (editor != null) {
				//■エディタで開いているファイルが自動実行対象かどうかを取得
				const firstLine = editor.document.lineAt(0);
				const values = firstLine.text.trim().split("=").map(item => item.trim());
				
				if(values.length === 2 && values[0] === "cline-auto-workflow"){//処理対象
					return [editor, values[1]];
				}
				else{
					return [editor, undefined];
				}
			}
			else{
				return [undefined, undefined];
			}
		})();
		//■状態の確認
		if(editor == null){
			console.log("[cline-auto-workflow] アクティブなエディタがないので、実行しません。");
			return;
		}
		if(workflowName == null){
			console.log("[cline-auto-workflow] ワークフローが指定されていないので、実行しません。");
			return;
		}
		if(workflowName.length > 25){
			vscode.window.showErrorMessage("The workflow name is too long and will not be executed. Please use up to 25 characters.");
			return;
		}
		if(/[<>:"/\\|?*]/.test(workflowName)){
			vscode.window.showErrorMessage("The workflow will not run because it contains invalid characters in the file name.");
			return;
		}


		//■実行
		{
			//■コマンドを生成
			const command = `Execute the '.clinerules\\workflows\\${workflowName}' workflow.`;

			//■commandを新しいエディタを開いて、全文選択
			const document = await vscode.workspace.openTextDocument({ content: command, language: 'plaintext' });
			const newEditor = await vscode.window.showTextDocument(document, { preview: false });
			

			//■選択されているテキストをclineのchatに送る
			await vscode.window.showTextDocument(document, vscode.ViewColumn.Active);//念のため、明示的にアクティブに。
			newEditor.selection = new vscode.Selection( new vscode.Position(0, 0), document.lineAt(document.lineCount - 1).range.end);
			await vscode.commands.executeCommand('cline.addToChat');	

			
			//■開いたエディタを閉じる
			await newEditor.edit(editBuilder => {
        editBuilder.delete(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(newEditor.document.lineCount, 0)));
    	});
			await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		
			//■enterキーのエミュレーション
			await vscode.commands.executeCommand('cline.focusChatInput');	//clineのチャットに明示的にフォーカス。
			const exePath = path.join(context.extensionPath, 'resources', 'EmulateEnter.exe');
			execFile(exePath, [], (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`[cline-auto-workflow] エラーが発生しました。 ${error.message}`);
					return;
				}
			});
		}
	})().then(() => {
		

	}).catch(reason => {
		console.error("[cline-auto-workflow]", reason);
	});
}
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// This method is called when your extension is deactivated
export function deactivate() {}
