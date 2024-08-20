# codebuddy - Custom Copilot

**codebuddy** is a VS Code extension that integrates with Groq Cloud API to provide language model completions directly within your editor. This extension allows you to interact with Groq's powerful models like `llama3-8b-8192`, offering capabilities similar to OpenAI's GPT models.

## Features

- **Chat Completions:** Generate responses from Groq Cloud API within your code editor.
- **Update API Key:** Easily update your Groq API key within the extension.
- **Custom Commands:** Use commands to interact with the Groq models directly from VS Code.

## Requirements

- [Visual Studio Code](https://code.visualstudio.com/) (version 1.82.0 or higher)
- A Groq Cloud API Key (sign up at [Groq Cloud](https://console.groq.com))

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/sahan1583/codebuddy.git
   cd codebuddy
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up the Environment:**

   Create a `.env` file in the root directory of the project and add your Groq API key:

   ```
   example: GROQ_API_KEY=sdk-12323
   ```

4. **Build the Extension:**

   Compile the TypeScript code:

   ```bash
   npm run compile
   ```

5. **Run the Extension:**

   Open the project in Visual Studio Code:

   ```bash
   code .
   ```

   Then press `F5` to start a new VS Code window with your extension loaded.

## Usage

### 1. **Using Chat Completions**

   - Highlight any text in the editor.
   - Right-click and select `General Prompt`.
   - The extension will send the selected text to Groq Cloud, and the response will appear in the output.

### 2. **Updating the API Key**

   - Open the command palette (`Ctrl+Shift+P`).
   - Type `custom-copilot.updateApiKey` and press `Enter`.
   - Enter your new API key when prompted.

   After updating the key, reload the VS Code window to apply the changes.



## Development

### 1. **Folder Structure**

   - `src/`: Contains all the TypeScript source files.
   - `out/`: Compiled JavaScript files after running the `compile` script.
   - `.vscode/`: Configuration files for VS Code.
   

### 2. **Scripts**

   - **Compile the Extension:**
     ```bash
     npm run compile
     ```
   - **Watch for Changes:**
     ```bash
     npm run watch
     ```
   - **Lint the Code:**
     ```bash
     npm run lint
     ```
