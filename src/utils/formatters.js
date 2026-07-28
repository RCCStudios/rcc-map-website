export function formatUnixTimestamp(unixTimestamp) {
    if (!unixTimestamp) return "N/A";
    var currentDate = new Date(Date.now())
    var currentDay = String(currentDate.getDate()).padStart(2, "0");
    var currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    var currentYear = currentDate.getFullYear();
    var date = new Date(unixTimestamp * 1000); // fix to ms
    var day = String(date.getDate()).padStart(2, "0");
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var year = date.getFullYear();

    var hours = String(date.getHours()).padStart(2, "0");
    var minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year}` === `${currentDay}/${currentMonth}/${currentYear}`
        ? `${hours}:${minutes}`
        : `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function formatNetworkStatus(networkStatus) {
    switch (networkStatus) {
        case 1:
            return "Wi-Fi";
        case 2:
            return "Ethernet";
        case 3:
            return "Cellular";
        case 0:
        default:
            return "Unknown";
    }
}

export function getStatusBadgeColor(user) {
    const currentTimestamp = Math.floor(Date.now() / 1000); // fix to ms
    const timeTo = 300;

    const timestamps = [
        user.batteryLevel?.timestamp,
        user.latitude?.timestamp,
        user.longitude?.timestamp,
        user.network?.timestamp,
        user.screenLock?.timestamp
    ].filter(Boolean);

    if (timestamps.length === 0) return "#e11025";

    const isFresh = (ts) => (currentTimestamp - ts) < timeTo;

    const allFresh = timestamps.every(isFresh);
    const someFresh = timestamps.some(isFresh);

    if (allFresh) return "#1bb23e";
    if (someFresh) return "#ffc107";
    return "#e11025";
}