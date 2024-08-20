


import * as vscode from "vscode";
import Groq from "groq-sdk";


let groq: any;
const SECRETS_STORE_KEY = "groqcloud-api-key";
const GROQCLOUD_MODEL = "llama3-8b-8192";

class ChatMessage {
  role: string = "";
  content: string = "";
}

class GroqCloudRequest {
  model: string = GROQCLOUD_MODEL;
  messages: ChatMessage[] = [];
  temperature: number = 0.7;
}

interface GroqCloudResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function activate(context: vscode.ExtensionContext) {
  let apiKey = await context.secrets.get(SECRETS_STORE_KEY);

  if (!apiKey) {
    apiKey = await vscode.window.showInputBox({ prompt: "Enter your GroqCloud API Key" });
    if (apiKey) {
      await context.secrets.store(SECRETS_STORE_KEY, apiKey);
    } else {
      vscode.window.showErrorMessage("API Key is required to use this extension.");
      return;
    }
  }

  groq = new Groq({ apiKey });

  addMenuCommand(context, "gptools.genJavaDocs", () => {
    executeWithProgress(() => generateJavaDocs(context));
  });

  addMenuCommand(context, "gptools.generalPrompt", () => {
    executeWithProgress(() => generalPrompt(context));
  });

  addMenuCommand(context, "gptools.updateApiKey", async () => {
    const newApiKey = await vscode.window.showInputBox({ prompt: "Enter new GroqCloud API Key" });
    if (newApiKey) {
      await context.secrets.store(SECRETS_STORE_KEY, newApiKey);
      groq = new Groq({ apiKey: newApiKey });
      vscode.window.showInformationMessage("API Key updated successfully.");
    }
  });
}

function executeWithProgress(callback: () => void) {
  vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: "Processing. Do not edit file now. Please wait...",
    cancellable: true
  }, async (progress, token) => {
    progress.report({ increment: 0 });
    await callback();
    progress.report({ increment: 100 });
  });
}

function addMenuCommand(context: vscode.ExtensionContext, command: string, callback: () => void) {
  let disposable = vscode.commands.registerCommand(command, callback);
  context.subscriptions.push(disposable);
}

async function generateJavaDocs(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const selection = editor.selection;
    const selText = editor.document.getText(selection);

    const req = new GroqCloudRequest();
    req.messages.push({ role: "system", content: "You are an experienced Java developer" });
    req.messages.push({ role: "user", content: `Generate the Javadoc for the following Java method below. Only provide the Javadoc comment itself:\n ${selText}` });

    const answer = await askGroqCloud(context, req);

    if (answer) {
      
      const edit = new vscode.TextEdit(
        new vscode.Range(selection.start, selection.start),
        answer + "\n"
      );
      const workspaceEdit = new vscode.WorkspaceEdit();
      workspaceEdit.set(editor.document.uri, [edit]);
      vscode.workspace.applyEdit(workspaceEdit);
    }
  }
}

async function generalPrompt(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const selection = editor.selection;
    const selText = editor.document.getText(selection);

    const req = new GroqCloudRequest();
    req.messages.push({ role: "user", content: selText });

    const answer = await askGroqCloud(context, req);

    if (answer) {
      const position = editor.selection.end.translate(1, 0);

      
      editor.edit(editBuilder => {
        editBuilder.insert(position, "\n\nGPT: " + answer + "\n");
      });
    }
  }
}

async function askGroqCloud(context: vscode.ExtensionContext, req: GroqCloudRequest): Promise<string | undefined> {
  try {
    const response: GroqCloudResponse = await groq.chat.completions.create(req);
    return response.choices[0]?.message?.content;
  } catch (error) {
    // Explicitly type the error
    const err = error as { message: string };
    vscode.window.showErrorMessage(`Error: ${err.message}`);
    return undefined;
  }
}

export function deactivate() { }
