import { GeoPoint } from '@models/geoPoint';
import { JsonObject } from './json';

export type LandmarkOpts = {
    ID?: string;
    Version?: number;
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
    Version: number;
    CreatedTimestamp: Date;
    ApprovedTimestamp?: Date;
    Location?: string;
    Address: string;
    Coordinates?: GeoPoint;
    Type?: LandmarkType;
    Artist: string;
    Title: string;
    ImageURL?: string;

    constructor({
        ID = crypto.randomUUID(),
        Version = Date.now(),
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
        this.ID = ID;
        this.Version = Version;
        this.CreatedTimestamp = CreatedTimestamp ? new Date(CreatedTimestamp) : new Date();
        this.ApprovedTimestamp = ApprovedTimestamp ? new Date(ApprovedTimestamp) : undefined;
        this.Location = Location;
        this.Address = Address;
        this.Coordinates = Coordinates;
        this.Type = Type;
        this.Artist = Artist;
        this.Title = Title;
        this.ImageURL = ImageURL;

        if (this.ApprovedTimestamp === undefined && Approved) {
            this.ApprovedTimestamp = new Date();
        }
    }

    toDynamoDBDocument() {
        return {
            id: this.ID,
            ver: this.Version,
            CreatedTimestamp: this.CreatedTimestamp.toISOString(),
            ApprovedTimestamp: this.ApprovedTimestamp?.toISOString(),
            Location: this.Location,
            Address: this.Address,
            Coordinates: this.Coordinates,
            Type: this.Type,
            Artist: this.Artist,
            Title: this.Title,
            ImageURL: this.ImageURL,
        } as JsonObject;
    }

    toJson() {
        return {
            ID: this.ID,
            Approved: this.ApprovedTimestamp !== undefined,
            Location: this.Location,
            Address: this.Address,
            Coordinates: this.Coordinates,
            Type: this.Type,
            Artist: this.Artist,
            Title: this.Title,
            ImageURL: this.ImageURL,
        } as JsonObject;
    }
}
