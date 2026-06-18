import { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetUploadUrlSchema } from '@schemas/uploadUrl';

import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';
import { validatorErrorHandler } from '@middlewares/validator';

const S3_BUCKET_ASSET_UPLOADS = process.env['S3_BUCKET_ASSET_UPLOADS'];
const client = new S3Client();

const getUploadUrlRequestSchema = transpileSchema({
    type: 'object',
    properties: {
        queryStringParameters: GetUploadUrlSchema,
    },
});

export const getUploadUrl: Handler = middy<APIGatewayProxyEvent, APIGatewayProxyResult>()
    .use(validator({ eventSchema: getUploadUrlRequestSchema }))
    .use(validatorErrorHandler())
    .use(httpErrorHandler())
    .handler(async (event: APIGatewayProxyEvent, context: any) => {
        const extension = event.queryStringParameters?.filename?.split('.').at(-1)?.toLowerCase() || 'jpg';

        const uniqueId = crypto.randomUUID();
        const filename = `${uniqueId}.${extension}`;
        const uploadUrl = await getPresignedUrl(filename);

        return {
            // Get signed URL
            statusCode: 200,
            isBase64Encoded: false,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                uploadURL: uploadUrl,
                distributionURL: `https://${S3_BUCKET_ASSET_UPLOADS}/${filename}`,
            }),
        };
    });

const getPresignedUrl = async (filename: string, requestValidityDuration: number = 900) => {
    const command = new PutObjectCommand({
        Bucket: S3_BUCKET_ASSET_UPLOADS,
        Key: filename,
        ContentType: 'image/*',
        CacheControl: 'max-age=31104000',
    });

    return getSignedUrl(client, command, {
        expiresIn: requestValidityDuration,
    });
};
