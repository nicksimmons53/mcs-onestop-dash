import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  S3Client
} from "@aws-sdk/client-s3";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-provider-cognito-identity";
import {CognitoIdentityClient} from "@aws-sdk/client-cognito-identity";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = "us-east-1";
const client = new S3Client({
  region,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region }),
    identityPoolId: "us-east-1:674f6454-6f99-4283-a38d-a89e64866a30",
  }),
});

const getObjects = async (user, prefix) => {
  let bucketName = `onboard-${user}`;

  try {
    let objects = await client.send(
      new ListObjectsCommand({
        Bucket: bucketName,
        Prefix: prefix + "/",
        Marker: prefix + "/",
      }),
    );

    return objects;
  } catch (error) {
    return error;
  }
}

const getFiles = async (user, clientName) => {
  let response = await getObjects(
    `${user.sageUserId}-${user.sageEmployeeNumber}`,
    clientName,
  );
  if (typeof response.Contents === "undefined") return;

  response.Contents.forEach(file => {
    file.Name = file.Key.split("/")[1];
    file.LastModified = new Date(file.LastModified).toLocaleString("en-us");
    file.Bucket = `onboard-${user.sageUserId}-${user.sageEmployeeNumber}`;
  });

  return response.Contents;
}

const deleteObject = async (username, key) => {
  let bucketName = "onboard-" + username;

  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );

    return "Object Deleted";
  } catch (error) {
    return error;
  }
};

const viewObject = async row => {
  try {
    let url = await getSignedUrl(
      client,
      new GetObjectCommand({
        Bucket: row.Bucket,
        Key: row.Key,
      }),
      { expiresIn: 7200 },
    );

    return url;
  } catch (error) {
    console.log(error)
    return error;
  }
};

const createBucket = async username => {
  const command = new CreateBucketCommand({
    Bucket: `mcs-onboard-${username}`,
    ACL: ''
  });

  try {
    const { Location } = await client.send(command);
    return Location;
  } catch (e) {
    console.log(e);
    return e;
  }
}

module.exports = {
  deleteObject,
  getFiles,
  getObjects,
  viewObject,
  createBucket,
}