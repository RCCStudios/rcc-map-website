import { getJson } from "./client";

export async function getToken(otp) {
    return getJson("/api/token", otp);
}