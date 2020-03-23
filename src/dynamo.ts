import { DynamoDB, AWSError } from 'aws-sdk' // eslint-disable-line import/no-extraneous-dependencies
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { PromiseResult } from "aws-sdk/lib/request";

const dynamoDb = new DynamoDB.DocumentClient();

export function scan(params: DocumentClient.ScanInput): Promise<PromiseResult<DocumentClient.ScanOutput, AWSError>> {
    return new Promise((resolve, reject) =>
        dynamoDb
            .scan(params)
            .promise()
            .then((data) => resolve(data))
            .catch((err) => reject(err))
    );
}

export function get(params: DocumentClient.GetItemInput) : Promise<PromiseResult<DocumentClient.GetItemOutput, AWSError>>  {
    return new Promise((resolve, reject) =>
        dynamoDb
            .get(params)
            .promise()
            .then((data) => resolve(data))
            .catch((err) => reject(err))
    );
}

export function createItem(params: DocumentClient.PutItemInput) :  Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>>  {
    return new Promise((resolve, reject) =>
        dynamoDb
            .put(params)
            .promise()
            .then((data) => resolve(data))
            .catch((err) => reject(err))
    );
}

export function updateItem(params: DocumentClient.UpdateItemInput): Promise<PromiseResult<DocumentClient.UpdateItemOutput, AWSError>>  {
    return new Promise((resolve, reject) =>
        dynamoDb
            .update(params)
            .promise()
            .then((data) => resolve(data))
            .catch((err) => reject(err))
    );
}

export function deleteItem(params: DocumentClient.DeleteItemInput): Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError>>  {
    return new Promise((resolve, reject) =>
        dynamoDb
            .delete(params)
            .promise()
            .then((data) => resolve(data))
            .catch((err) => reject(err))
    );
}
