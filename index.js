const { Probot } = require('probot');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

/**
 * Probot app to integrate with OpenAI's Codex via ChatGPT.
 * Listens for issue comment events and responds with generated code.
 *
 * @param {import('probot').Probot} app - Probot application instance
 */
module.exports = (app) => {
  // Initialize OpenAI API configuration using API key from environment variables.
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  // Respond to issue comment creation events.
  app.on('issue_comment.created', async (context) => {
    const commentBody = context.payload.comment.body || '';
    // Only process commands that start with "/codex generate"
    if (commentBody.startsWith('/codex generate')) {
      // Extract the prompt after the command.
      const prompt = commentBody.replace('/codex generate', '').trim();
      // Inform the user that code generation is in progress.
      await context.octokit.issues.createComment(
        context.issue({ body: 'Generating code...' })
      );
      try {
        // Call OpenAI Chat Completion API with a system prompt to generate only code.
        const completion = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful assistant that generates code based on user requests. Return only the code with no surrounding backticks or explanations.',
            },
            { role: 'user', content: prompt },
          ],
          max_tokens: 300,
        });
        const code = completion.data.choices[0].message.content.trim();
        // Post the generated code as a new comment.
        await context.octokit.issues.createComment(
          context.issue({ body: code })
        );
      } catch (error) {
        console.error(error);
        // Notify the user of any errors.
        await context.octokit.issues.createComment(
          context.issue({ body: `An error occurred: ${error.message}` })
        );
      }
    }
  });
};
