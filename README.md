# Codex Connector Demo

This repository contains a minimal GitHub App that integrates GitHub with OpenAI's ChatGPT Codex (via the OpenAI API) to generate code snippets in response to issue comments. It demonstrates how to scaffold a simple connector that listens to GitHub events and uses Codex to produce code.

## How it works

1. A GitHub App built using Probot listens for `issue_comment` events.
2. When a comment starts with `/codex generate`, the rest of the comment is treated as a prompt for ChatGPT Codex.
3. The app calls the OpenAI API with your specified model to generate a code snippet.
4. The app posts the generated code as a reply comment.

## Prerequisites

* A GitHub account with permissions to create and install a GitHub App.
* Node.js (v18 or later) and npm.
* An OpenAI API key with access to Codex (ChatGPT) models.

OpenAI's help center notes that pushing code, updates, or pull requests directly to GitHub is available through the Codex product. This demo uses the OpenAI API to approximate Codex functionality.

## Setup

1. **Clone the repository**:

   ```sh
   git clone https://github.com/your-username/codex-connector-demo.git
   cd codex-connector-demo
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Create a GitHub App**:

   1. Navigate to `https://github.com/settings/apps` and click **New GitHub App**.
   2. Fill in an App name and set the **Webhook URL** to your local or deployed server URL (e.g. `https://your-domain.com/api/github/webhooks`).
   3. Generate a private key and download it.
   4. Set **Permissions**:
      * **Repository** → **Read and write** for issues.
   5. Subscribe to the **Issue comment** event.
   6. After creation, note the **App ID**, **Client ID**, and **Webhook secret**, and install the app on a test repository.

4. **Configure environment variables**:

   Create a `.env` file in the project root with the following variables:

   ```env
   APP_ID=your_app_id
   PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----
   WEBHOOK_SECRET=your_webhook_secret
   OPENAI_API_KEY=sk-your-openai-api-key
   ```

   This example uses environment variables for security. Do **not** commit your private key or API keys to the repository.

5. **Run the app locally**:

   ```sh
   npx probot run ./index.js
   ```

   Probot will start a local server. Use [ngrok](https://ngrok.com/) or a similar tool to expose your local port and update the GitHub App's webhook URL accordingly.

## Usage

1. Open an issue in the repository where the app is installed.
2. Add a comment starting with `/codex generate` followed by your code request, for example:

   ````
   /codex generate Write a Python function that returns the factorial of a number.
   ````

3. The app will reply with a generated code snippet.

## Notes

* The app uses ChatGPT's `gpt-4o` model by default. You can customize the model by editing `index.js`.
* This is a minimal demo. For production use, implement error handling, rate limiting, caching, and security best practices.
* The Codex product provides a more integrated experience inside ChatGPT, including generating, editing, and pushing code directly to GitHub. This app uses the OpenAI API as a proxy to replicate basic functionality.
