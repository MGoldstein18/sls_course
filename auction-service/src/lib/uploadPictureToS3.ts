import * as AWS from "aws-sdk";

type uploadToS3Function = (key: string, body: string) => any;

const s3 = new AWS.S3();

export const uploadPictureToS3: uploadToS3Function = async (key, body) => {
  const result = await s3
    .upload({
      Bucket: process.env.AUCTIONS_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    })
    .promise();
  return result;
};
