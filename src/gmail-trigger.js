const AWS = require("aws-sdk");
const sqs = new AWS.SQS();

exports.handler = async (event) => {
  try {
    const workflowId = `workflow_${Date.now()}`;
    const messageBody = {
      workflowId,
      currentNode: "gmail_trigger",
      payload: { message: "Trigger received to start workflow" },
    };

    await sqs
      .sendMessage({
        QueueUrl: process.env.QUEUE_MANAGER_URL,
        MessageBody: JSON.stringify(messageBody),
      })
      .promise();

    console.log("Gmail Trigger sent message to Queue Manager");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Workflow started successfully" }),
    };
  } catch (error) {
    console.error("Error in Gmail Trigger:", error);
    throw error;
  }
};
