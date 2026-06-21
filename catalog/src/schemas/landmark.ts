// Schemas for requests operating on landmarks

export const GetLandmarkSchema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'http://api.lobbyart.org/schemas/getLandmark.json',
    title: 'GetLandmarkSchema',
    description: 'Fields to retrieve a Landmark record',
    type: 'object',
    required: ['ID'],
    properties: {
        ID: {
            description: 'The ID of the landmark',
            type: 'string',
            format: 'uuid',
        },
    },
};

export const PatchLandmarkSchema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'http://api.lobbyart.org/schemas/putLandmark.json',
    title: 'PutLandmarkSchema',
    description: 'Fields to create a Landmark record',
    type: 'object',
    properties: {
        Approved: {
            description: 'Whether the landmark has been approved for inclusion in the public data set',
            type: 'boolean',
        },
        Location: {
            description: "The name of the landmark's location",
            type: ['string', 'null'],
        },
        Address: {
            description: 'The street address of the landmark',
            type: 'string',
        },
        Coordinates: {
            description: "The landmark's latitude and longitude",
            type: 'array',
            prefixItems: [
                { type: 'number', description: 'Latitude', minimum: -90, maximum: 90 },
                { type: 'number', description: 'Longitude', minimum: -180, maximum: 180 },
            ],
            minItems: 2,
            maxItems: 2,
        },
        Type: {
            description: "The landmark type, either 'Outdoor' or 'Lobby'",
            type: 'string',
            enum: ['Outdoor', 'Lobby'],
        },
        Artist: {
            description: 'The artist attributed to the artwork',
            type: 'string',
        },
        Title: {
            description: 'The title of the artwork',
            type: 'string',
        },
        ImageURL: {
            description: 'The URL of the artwork image',
            type: 'string',
            format: 'uri',
        },
    },
};

export const PostLandmarkSchema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'http://api.lobbyart.org/schemas/postLandmark.json',
    title: 'PostLandmarkSchema',
    description: 'Fields to create a Landmark record',
    type: 'object',
    required: ['Address', 'Artist', 'Title'],
    properties: {
        Location: {
            description: "The name of the landmark's location",
            type: 'string',
        },
        Address: {
            description: 'The street address of the landmark',
            type: 'string',
        },
        Coordinates: {
            description: "The landmark's latitude and longitude",
            type: 'array',
            prefixItems: [
                { type: 'number', description: 'Latitude', minimum: -180, maximum: 180 },
                { type: 'number', description: 'Longitude', minimum: -90, maximum: 90 },
            ],
            minItems: 2,
            maxItems: 2,
        },
        Type: {
            description: "The landmark type, either 'Outdoor' or 'Lobby'",
            type: 'string',
            enum: ['Outdoor', 'Lobby'],
        },
        Artist: {
            description: 'The artist attributed to the artwork',
            type: 'string',
        },
        Title: {
            description: 'The title of the artwork',
            type: 'string',
        },
        ImageURL: {
            description: 'The URL of the artwork image',
            type: 'string',
            format: 'uri',
        },
    },
};
