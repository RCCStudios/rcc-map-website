import { getJson } from "./client";

export async function getTelemetry(token) {
    return getJson("/api/telemetry", token);
}