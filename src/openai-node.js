const AWS = require("aws-sdk");
const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (event) => {
  try {
    for (const record of event.Records) {
      const message = JSON.parse(record.body);
      const { workflowId, payload } = message;

      console.log(`OpenAI Node processing workflow: ${workflowId}`);

      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const openai = new OpenAIApi(configuration);
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: payload.extractedText,
        max_tokens: 100,
      });

      console.log(
        `OpenAI response for workflow ${workflowId}:`,
        response.data.choices[0].text
      );
    }

    return { message: "OpenAI processed successfully" };
  } catch (error) {
    console.error("Error in OpenAI Node:", error);
    throw error;
  }
};
