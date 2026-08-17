import { postJson } from "./client";

export function bomb(token, user) {
    return postJson("/api/user/bomb", token, { id: user.id });
}