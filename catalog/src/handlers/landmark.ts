import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';
import { GetLandmarkSchema, PostLandmarkSchema, PatchLandmarkSchema } from '@schemas/landmark';
import { DynamoDB } from '@stores/dynamoDB';
import { Landmark, LandmarkOpts } from '@models/landmark';
import { validatorErrorHandler } from '@middlewares/validator';

const DDB_TABLE_WORKS = process.env['DDB_TABLE_WORKS'];
const ddbClient = new DynamoDB(DDB_TABLE_WORKS!, 'id', 'ver');

const getLandmarkRequestSchema = transpileSchema({
    type: 'object',
    required: ['pathParameters'],
    properties: {
        pathParameters: GetLandmarkSchema,
    },
});

export const getLandmark: Handler = middy<APIGatewayProxyEvent, APIGatewayProxyResult>()
    .use(validator({ eventSchema: getLandmarkRequestSchema }))
    .use(validatorErrorHandler())
    .use(httpErrorHandler())
    .handler(async (request: APIGatewayProxyEvent, context: any) => {
        const landmarkId = request.pathParameters?.ID!;

        const response = await ddbClient.retrieveLatest(landmarkId);
        const result = response.Items?.[0];

        if (!result) {
            return {
                statusCode: 404,
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    message: 'an item with the specified ID could not be found',
                }),
            };
        } else {
            const landmark = new Landmark(result as LandmarkOpts);

            return {
                statusCode: 200,
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify(landmark.toJson()),
            };
        }
    });

const patchLandmarkRequestSchema = transpileSchema({
    type: 'object',
    required: ['pathParameters', 'body'],
    properties: {
        pathParameters: GetLandmarkSchema,
        body: PatchLandmarkSchema,
    },
});

export const patchLandmark: Handler = middy<APIGatewayProxyEvent, APIGatewayProxyResult>()
    .use(jsonBodyParser())
    .use(validator({ eventSchema: patchLandmarkRequestSchema }))
    .use(validatorErrorHandler())
    .use(httpErrorHandler())
    .handler(async (request: APIGatewayProxyEvent, context: any) => {
        const landmarkId = request.pathParameters?.ID!;

        const response = await ddbClient.retrieveLatest(landmarkId);
        const item = response.Items?.[0];

        if (!item) {
            return {
                statusCode: 404,
                isBase64Encoded: false,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    message: 'an item with the specified ID could not be found',
                }),
            };
        }

        const landmark = new Landmark(item as LandmarkOpts);
        Object.assign(landmark, request.body, { Version: new Date() });

        const putResult = await ddbClient.put(landmark.toDynamoDBDocument());

        return {
            statusCode: 200,
            isBase64Encoded: false,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(landmark.toJson()),
        };
    });

const postLandmarkRequestSchema = transpileSchema({
    type: 'object',
    required: ['body'],
    properties: {
        body: PostLandmarkSchema,
    },
});

export const postLandmark: Handler = middy<APIGatewayProxyEvent, APIGatewayProxyResult>()
    .use(jsonBodyParser())
    .use(validator({ eventSchema: postLandmarkRequestSchema }))
    .use(validatorErrorHandler())
    .use(httpErrorHandler())
    .handler(async (request: APIGatewayProxyEvent, context: any) => {
        const landmarkOpts = request.body as any as LandmarkOpts;
        const item = new Landmark(landmarkOpts);

        const result = await ddbClient.put(item.toDynamoDBDocument());

        return {
            statusCode: 200,
            isBase64Encoded: false,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(item.toJson()),
        };
    });
