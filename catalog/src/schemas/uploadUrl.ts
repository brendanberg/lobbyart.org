// Schema for requests to get an upload URL

export const GetUploadUrlSchema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'http://api.lobbyart.org/schemas/getUploadUrl.json',
    title: 'GetUploadUrlSchema',
    description: 'Request schema to get an upload URL',
    type: 'object',
    properties: {
        filename: {
            description: "The resource filename ending in 'jpg', 'jpeg', or 'png'",
            type: 'string',
            pattern: '\\.(jpe?g|png)$',
        },
    },
};
