const AWS = require("aws-sdk");
const { OCR } = require("paddleocr");

exports.handler = async (event) => {
  try {
    for (const record of event.Records) {
      const message = JSON.parse(record.body);
      const { workflowId, payload } = message;

      console.log(`OCR Node processing workflow: ${workflowId}`);

      // Simulate OCR processing (replace with actual PaddleOCR logic)
      const extractedText = `Extracted text from document in workflow ${workflowId}`;

      const nextMessage = {
        workflowId,
        currentNode: "ocrNode",
        payload: { extractedText },
      };

      const sqs = new AWS.SQS();
      await sqs
        .sendMessage({
          QueueUrl: process.env.QUEUE_MANAGER_URL,
          MessageBody: JSON.stringify(nextMessage),
        })
        .promise();

      console.log("OCR Node sent message to Queue Manager");
    }

    return { message: "OCR processed successfully" };
  } catch (error) {
    console.error("Error in OCR Node:", error);
    throw error;
  }
};
