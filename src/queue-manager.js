const AWS = require("aws-sdk");
const sqs = new AWS.SQS();

exports.handler = async (event) => {
  try {
    for (const record of event.Records) {
      const message = JSON.parse(record.body);
      const { workflowId, currentNode, payload } = message;

      console.log(`Queue Manager: Current Node is ${currentNode}`);

      // Define the node execution order
      const nodeExecutionOrder = ["gmail_trigger", "ocr_node", "openai_node"];
      const currentIndex = nodeExecutionOrder.indexOf(currentNode);

      if (currentIndex < 0 || currentIndex + 1 >= nodeExecutionOrder.length) {
        console.log(`Workflow ${workflowId} completed.`);
        return;
      }

      // Get the next node to execute
      const nextNode = nodeExecutionOrder[currentIndex + 1];

      // Determine the queue URL for the next node
      const queueUrl = process.env[`${nextNode.toUpperCase()}_QUEUE_URL`];

      const nextMessage = {
        workflowId,
        currentNode: nextNode,
        payload,
      };

      await sqs
        .sendMessage({
          QueueUrl: queueUrl,
          MessageBody: JSON.stringify(nextMessage),
        })
        .promise();

      console.log(
        `Transitioned from ${currentNode} to ${nextNode} for workflow ${workflowId}`
      );
    }
  } catch (error) {
    console.error("Error in Queue Manager:", error);
    throw error;
  }
};
