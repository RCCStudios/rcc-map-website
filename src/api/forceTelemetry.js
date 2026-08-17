import { postJson } from "./client";

export function forceTelemetry(token, user) {
    return postJson("/api/telemetry/force", token, { id: user.id });
}