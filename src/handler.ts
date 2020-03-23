import * as db from "./dynamo";
import { Context, Callback, Handler } from "aws-lambda/handler";
import { APIGatewayEvent } from "aws-lambda";
import Joi = require('@hapi/joi');

const tableName = "books"

type Book = {}
const bookSchema = Joi.object({
    uuid: Joi.number().required(),
    name: Joi.string().required(),
    releaseDate: Joi.number().integer().required(),
    authorName: Joi.string().required()
});

export const create: Handler<APIGatewayEvent, any> = async (evt: APIGatewayEvent, ctx: Context, cb: Callback<any>) => {
    try {
        const item = JSON.parse(evt.body);
        bookSchema.validate(item);
        const params = {
            TableName: tableName,
            Item: item,
        };
        const result = await db.createItem(params);
        cb(null, {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(result)
        });
    } catch (error) {
        cb(error)
    }
}

export const update: Handler<APIGatewayEvent, any> = async (evt: APIGatewayEvent, ctx: Context, cb: Callback<any>) => {
    try {
        const uuid = evt.pathParameters.bookUuid;
        const args = JSON.parse(evt.body);
        bookSchema.validate(args);
        const params = {
            TableName: tableName,
            Key: {
                uuid,
            },
            ExpressionAttributeValues: {
                ":newName": args.name,
                ":releaseDate": args.releaseDate,
                ":authorName": args.authorName,
            },
            ExpressionAttributeNames: {
                "#newName": "name"
              },
            UpdateExpression:
                "SET #newName = :newName, releaseDate = :releaseDate, authorName = :authorName",
            ReturnValues: "ALL_NEW",
        };

        const result = await db.updateItem(params);
        cb(null, {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(result)
        })
    } catch (error) {
        cb(error);
    }
}

export const deleteItem: Handler<APIGatewayEvent, any> = async (evt: APIGatewayEvent, ctx: Context, cb: Callback<any>) => {
    try {
        const uuid = evt.pathParameters.bookUuid;
        const params = {
            TableName: tableName,
            Key: {
                uuid,
            },
        };

        const result = await db.deleteItem(params);
        cb(null, {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(result)
        })
    } catch (error) {
        cb(error);
    }
}


export const get: Handler<APIGatewayEvent, any> = async (evt: APIGatewayEvent, ctx: Context, cb: Callback<any>) => {
    try {
        const uuid = evt.pathParameters.bookUuid;
        const params = {
            TableName: tableName,
            Key: {
                uuid,
            },
        };

        const result = await db.get(params);

        const book: Book = result.Item
        return cb(null, {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(book)
        })
    } catch (error) {
        cb(error);
    }
}

export const list: Handler<APIGatewayEvent, any> = async (evt: APIGatewayEvent, ctx: Context, cb: Callback<any>) => {
    const params = {
        TableName: tableName,
        AttributesToGet: ["uuid", "name", "releaseDate", "authorName"],
    };
    try {
        const result = await db.scan(params);
        const products = result.Items
        cb(null, {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(products)
        })

    } catch (error) {
        cb(error)
    }
}
