import {
  DeleteMessageCommand,
  SendMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs"
import { AwsServiceTypes } from "acp-types"

const pushMessageToQueue = async (
  params: AwsServiceTypes.PushMessageToQueueParams,
): Promise<string | undefined> => {
  const client = new SQSClient({ region: process.env.REGION })
  const sendMessageCommand = new SendMessageCommand({
    QueueUrl: params.queueUrl,
    MessageBody: params.messageBody,
    MessageGroupId: params.messageGroupId,
  })
  const result = await client.send(sendMessageCommand)
  if (result?.MessageId) {
    return result.MessageId
  }
}

const deleteMessageFromQueue = async (
  params: AwsServiceTypes.DeleteMessageFromQueueParams,
): Promise<void> => {
  const client = new SQSClient({ region: process.env.REGION })
  const sendMessageCommand = new DeleteMessageCommand({
    QueueUrl: params.queueUrl,
    ReceiptHandle: params.receiptHandle,
  })

  await client.send(sendMessageCommand)
}

export const queueHelperExports = {
  pushMessageToQueue,
  deleteMessageFromQueue,
}
