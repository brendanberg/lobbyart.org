export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export interface JsonArray extends Array<JsonValue> {}
export type JsonType = JsonObject | JsonArray;
