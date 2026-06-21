import { GeoPoint } from '@models/geoPoint';
import { JsonObject } from './json';

export type LandmarkOpts = {
    id?: string;
    ver?: string;
    CreatedTimestamp?: string;
    ApprovedTimestamp?: string;
    Approved?: boolean;
    Location?: string;
    Address: string;
    Coordinates?: GeoPoint;
    Type?: LandmarkType;
    Artist: string;
    Title: string;
    ImageURL?: string;
};

export type LandmarkType = 'Outdoor' | 'Lobby';

export class Landmark {
    ID: string;
    Version: string;
    CreatedTimestamp: Date;
    ApprovedTimestamp?: Date;
    Location?: string;
    Address: string;
    Coordinates?: GeoPoint;
    Type?: LandmarkType;
    Artist: string;
    Title: string;
    ImageURL?: string;

    _changed: string[];

    constructor({
        id = crypto.randomUUID(),
        ver = Date.now().toString(),
        CreatedTimestamp = undefined,
        ApprovedTimestamp = undefined,
        Approved = undefined,
        Location = undefined,
        Address,
        Coordinates = undefined,
        Type = undefined,
        Artist,
        Title,
        ImageURL = undefined,
    }: LandmarkOpts) {
        this.ID = id;
        this.Version = ver;
        this.CreatedTimestamp = CreatedTimestamp ? new Date(CreatedTimestamp) : new Date();
        this.ApprovedTimestamp = ApprovedTimestamp ? new Date(ApprovedTimestamp) : undefined;
        this.Location = Location;
        this.Address = Address;
        this.Coordinates = Coordinates;
        this.Type = Type;
        this.Artist = Artist;
        this.Title = Title;
        this.ImageURL = ImageURL;

        if (this.ApprovedTimestamp == undefined && Approved) {
            this.ApprovedTimestamp = new Date();
        }

        this._changed = [];
    }

    update(obj: {
        ver?: string;
        Approved?: boolean;
        Location?: string;
        Address?: string;
        Coordinates?: GeoPoint;
        Type?: LandmarkType;
        Artist?: string;
        Title?: string;
        ImageURL?: string;
    }) {
        if (obj.Approved !== undefined) {
            (obj as any).ApprovedTimestamp = obj.Approved ? new Date() : null;
            delete obj.Approved;
        }

        this._changed = Array.from(new Set(Object.keys(obj)).union(new Set(this._changed)));
        Object.assign(this, obj);
    }

    getPropertyChanges() {
        const item = this.toDynamoDBDocument();

        // Properties that have been un-set will come back undefined, but we want to put
        // nulls in the DDB history record.
        const properties = Object.fromEntries(
            this._changed.map((key: string) => {
                return [key, item[key] || null];
            }),
        );

        Object.assign(properties, { id: item.id, ver: Date.now().toString() });

        return properties;
    }

    toDynamoDBDocument() {
        // This is probably unorthodox, but we want to replace empty strings and null values with undefined.
        return {
            id: this.ID,
            ver: this.Version.toString(),
            CreatedTimestamp: this.CreatedTimestamp.toISOString() || undefined,
            ApprovedTimestamp: this.ApprovedTimestamp?.toISOString() || undefined,
            Location: this.Location || undefined,
            Address: this.Address || undefined,
            Coordinates: this.Coordinates || undefined,
            Type: this.Type || undefined,
            Artist: this.Artist || undefined,
            Title: this.Title || undefined,
            ImageURL: this.ImageURL || undefined,
        } as JsonObject;
    }

    toJson() {
        return {
            ID: this.ID,
            Approved: this.ApprovedTimestamp !== undefined && this.ApprovedTimestamp !== null,
            Location: this.Location,
            Address: this.Address,
            Coordinates: this.Coordinates,
            Type: this.Type,
            Artist: this.Artist,
            Title: this.Title,
            ImageURL: this.ImageURL,
        } as JsonObject;
    }

    toGeojson() {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                // MapBox coordinates are (confusingly) <LONGITUDE>, <LATITUDE>
                coordinates: this.Coordinates?.reverse(),
            },
            properties: {
                'feature-type': { Lobby: 'private-lobby', Outdoor: 'private-outdoor' }[this.Type || 'Lobby'],
                Location: this.Location,
                Address: this.Address,
                Artist: this.Artist,
                Title: this.Title,
                Image: this.ImageURL,
            },
        } as JsonObject;
    }
}
