import { PublishCommand, SNSClient } from "@aws-sdk/client-sns"
import { AwsServiceTypes } from "acp-types"
const publishMessageToSnsTopic = async (
  params: AwsServiceTypes.SendMessageToSnsTopicParams,
): Promise<string | undefined> => {
  const client = new SNSClient({ region: process.env.REGION })
  const publishCommand = new PublishCommand({
    TopicArn: params.topicArn,
    Message: params.messageBody,
    MessageAttributes: params.messageAttributes,
    MessageGroupId: params.messageGroupId,
  })
  const sendResult = await client.send(publishCommand)
  if (sendResult?.MessageId) {
    return sendResult.MessageId
  }
}

export const snsHelperExports = {
  publishMessageToSnsTopic,
}
