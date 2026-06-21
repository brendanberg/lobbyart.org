import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { JsonObject } from '@models/json';

export class DynamoDB {
    client: DynamoDBDocument;
    table_name: string;
    hash_key: string;
    range_key: string;
    batch_items: { [key: string]: JsonObject };

    constructor(table_name: string, hash_key: string = 'hash', range_key: string = 'range') {
        this.table_name = table_name;
        this.hash_key = hash_key;
        this.range_key = range_key;
        this.batch_items = {};

        const client = new DynamoDBClient({ maxAttempts: 3 });
        this.client = DynamoDBDocument.from(client);
    }

    async get(hash_value: string, range_value: string) {
        return await this.client.get({
            TableName: this.table_name,
            Key: {
                [this.hash_key]: hash_value,
                [this.range_key]: range_value,
            },
        });
    }

    async batchWrite(putItems: JsonObject[], deleteItems: JsonObject[] = []) {
        return await this.client.batchWrite({
            RequestItems: {
                [this.table_name]: putItems
                    .map((item) => ({ PutRequest: { Item: item } }) as any)
                    .concat(deleteItems.map((item) => ({ DeleteRequest: { Item: item } }) as any)),
            },
        });
    }

    async query(
        keyConditionExpr: string,
        filterExpr: string,
        attributeValues: { [key: string]: any },
        attributeNames: { [key: string]: string },
    ) {
        return await this.client.query({
            TableName: this.table_name,
            KeyConditionExpression: keyConditionExpr,
            FilterExpression: filterExpr,
            ExpressionAttributeValues: attributeValues,
            ExpressionAttributeNames: attributeNames,
        });
    }

    async scan(filterExpr: string, attributeValues: { [key: string]: any }, attributeNames: { [key: string]: string }) {
        return await this.client.scan({
            TableName: this.table_name,
            FilterExpression: filterExpr,
            ExpressionAttributeValues: attributeValues,
            ExpressionAttributeNames: attributeNames,
        });
    }

    async put(item: JsonObject) {
        return await this.client.put({
            TableName: this.table_name,
            Item: item,
        });
    }

    async update(item: JsonObject) {
        const { [this.hash_key]: hash_value, [this.range_key]: range_value, ...updates } = item;
        const updateEntries = Object.entries(updates);

        // const updateExpression =
        return await this.client.update({
            TableName: this.table_name,
            Key: {
                [this.hash_key]: hash_value,
                [this.range_key]: range_value,
            },
            UpdateExpression: 'set ' + updateEntries.map(([k, v]) => `#${k} = :${k}`).join(', '),
            ExpressionAttributeNames: updateEntries.reduce((d, [k, v]) => {
                Object.assign(d, { [`#${k}`]: k });
                return d;
            }, {}),
            ExpressionAttributeValues: updateEntries.reduce((d, [k, v]) => {
                Object.assign(d, { [`:${k}`]: v });
                return d;
            }, {}),
        });
    }
}
