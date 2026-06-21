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

const listWorksGeojsonRequestSchema = transpileSchema({
    type: 'object',
    properties: {
        // queryStringParameters: listWorksGeojsonSchema,
    },
});

export const listWorksGeojson: Handler = middy<APIGatewayProxyEvent, APIGatewayProxyResult>()
    .use(httpHeaderNormalizer())
    .use(
        cors({
            methods: 'GET',
            headers: allowedHeaders.join(','),
            getOrigin: (incomingOrigin, options) => {
                return incomingOrigin;
            },
        }),
    )
    .use(validator({ eventSchema: listWorksGeojsonRequestSchema }))
    .use(validatorErrorHandler())
    .use(httpErrorHandler())
    .handler(async (request: APIGatewayProxyEvent, context: any) => {
        const resultSet = await ddbClient.scan(
            'attribute_exists(#approved) AND #approved <> :null AND #ver = :ver',
            { ':null': null, ':ver': '*' },
            { '#approved': 'ApprovedTimestamp', '#ver': 'ver' },
        );

        return {
            statusCode: 200,
            isBase64Encoded: false,
            headers: {
                'Content-Type': 'application/geo+json',
            },
            body: JSON.stringify({
                type: 'FeatureCollection',
                name: 'Museum of Lobby Art',
                features: resultSet.Items?.map((record) => {
                    const work = new Landmark(record as LandmarkOpts);
                    return work.toGeojson();
                }),
            }),
        };
    });
