export async function postJson(url, auth, body) {
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Authorization": `Bearer ${auth}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    return response.json().catch(() => null);
}