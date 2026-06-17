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

    async retrieveLatest(hash_value: string) {
        return await this.client.query({
            TableName: this.table_name,
            KeyConditionExpression: '#hash = :hkey',
            ExpressionAttributeValues: {
                ':hkey': hash_value,
            },
            ExpressionAttributeNames: {
                '#hash': this.hash_key,
            },
            ScanIndexForward: false,
            Limit: 1,
        });
    }

    async query(key: string) {
        return await this.client.query({
            TableName: this.table_name,
            KeyConditionExpression: '#hash = :hkey',
            ExpressionAttributeValues: {
                ':hkey': key,
            },
            ExpressionAttributeNames: {
                '#hash': this.hash_key,
            },
        });
    }

    async put(item: JsonObject) {
        return await this.client.put({
            TableName: this.table_name,
            Item: item,
        });
    }
}
