import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import validator from '@middy/validator';
import cors from '@middy/http-cors';
import { transpileSchema } from '@middy/validator/transpile';
import { GetLandmarkSchema, PostLandmarkSchema, PatchLandmarkSchema } from '@schemas/landmark';
import { DynamoDB } from '@stores/dynamoDB';
import { Landmark, LandmarkOpts } from '@models/landmark';
import { validatorErrorHandler } from '@middlewares/validator';

const DDB_TABLE_WORKS = process.env['DDB_TABLE_WORKS'];
const ddbClient = new DynamoDB(DDB_TABLE_WORKS!, 'id', 'ver');

const allowedHeaders = ['Accept', 'Authorization', 'Content-Type', 'Origin', 'x-amz-date', 'x-apigateway-header'];

const getLandmarkRequestSchema = transpileSchema({
    type: 'object',
    required: ['pathParameters'],
    properties: {
        pathParameters: GetLandmarkSchema,
    },
});

export const getLandmark: Handler = middy<APIGatewayProxyEvent, APIGatewayProxyResult>()
    .use(httpHeaderNormalizer())
    .use(
        cors({
            methods: 'GET,PATCH',
            headers: allowedHeaders.join(','),
            getOrigin: (incomingOrigin, options) => {
                return incomingOrigin;
            },
        }),
    )
    .use(validator({ eventSchema: getLandmarkRequestSchema }))
    .use(validatorErrorHandler())
    .use(httpErrorHandler())
    .handler(async (request: APIGatewayProxyEvent, context: any) => {
        const landmarkId = request.pathParameters?.ID!;

        const result = await ddbClient.get(landmarkId, '*');

        if (!result?.Item) {
            return {
                statusCode: 404,
                isBase64Encoded: false,
                body: JSON.stringify({
                    message: 'an item with the specified ID could not be found',
                }),
            };
        } else {
            const landmark = new Landmark(result.Item as unknown as LandmarkOpts);

            return {
                statusCode: 200,
                isBase64Encoded: false,
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
    .use(httpHeaderNormalizer())
    .use(
        cors({
            methods: 'GET,PATCH',
            headers: allowedHeaders.join(','),
            getOrigin: (incomingOrigin, options) => {
                return incomingOrigin;
            },
        }),
    )
    .use(jsonBodyParser())
    .use(validator({ eventSchema: patchLandmarkRequestSchema }))
    .use(validatorErrorHandler())
    .use(httpErrorHandler())
    .handler(async (request: APIGatewayProxyEvent, context: any) => {
        const landmarkId = request.pathParameters?.ID!;

        const result = await ddbClient.get(landmarkId, '*');

        if (!result?.Item) {
            return {
                statusCode: 404,
                isBase64Encoded: false,
                body: JSON.stringify({
                    message: 'an item with the specified ID could not be found',
                }),
            };
        }

        const landmark = new Landmark(result.Item as LandmarkOpts);
        landmark.update(request.body as any);

        const writeResult = await ddbClient.batchWrite([landmark.toDynamoDBDocument(), landmark.getPropertyChanges()]);

        return {
            statusCode: 200,
            isBase64Encoded: false,
            body: JSON.stringify(landmark.toJson()),
        };
    });

export const listLandmarks: Handler = middy<APIGatewayProxyEvent, APIGatewayProxyResult>()
    .use(httpHeaderNormalizer())
    .use(
        cors({
            methods: 'GET,POST',
            headers: allowedHeaders.join(','),
            getOrigin: (incomingOrigin, options) => {
                return incomingOrigin;
            },
        }),
    )
    .use(httpErrorHandler())
    .handler(async (request: APIGatewayProxyEvent, context: any) => {
        const resultSet = await ddbClient.scan('#ver = :ver', { ':ver': '*' }, { '#ver': 'ver' });

        return {
            statusCode: 200,
            isBase64Encoded: false,
            headers: {
                'Content-Type': 'application/geo+json',
            },
            body: JSON.stringify({
                Works: resultSet.Items?.map((record) => {
                    const work = new Landmark(record as LandmarkOpts);
                    return work.toJson();
                }),
            }),
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
    .use(httpHeaderNormalizer())
    .use(
        cors({
            methods: 'GET,POST',
            headers: allowedHeaders.join(','),
            getOrigin: (incomingOrigin, options) => {
                return incomingOrigin;
            },
        }),
    )
    .use(jsonBodyParser())
    .use(validator({ eventSchema: postLandmarkRequestSchema }))
    .use(validatorErrorHandler())
    .use(httpErrorHandler())
    .handler(async (request: APIGatewayProxyEvent, context: any) => {
        const landmarkOpts = request.body as any as LandmarkOpts;
        const landmark = new Landmark(landmarkOpts);
        const item = landmark.toDynamoDBDocument();

        // The current record has '*' as the range key.
        const latest = Object.assign({}, item, { ver: '*' });
        const batchResult = await ddbClient.batchWrite([item, latest]);

        return {
            statusCode: 200,
            isBase64Encoded: false,
            body: JSON.stringify(landmark.toJson()),
        };
    });
