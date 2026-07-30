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

export function formatNetworkStatus(networkStatus, t) {
    if (!t) return "N/A";
    
    switch (networkStatus) {
        case 1:
            return t('status.network.wi-fi');
        case 2:
            return t('status.network.ethernet');
        case 3:
            return t('status.network.cellular');
        case 0:
        default:
            return t('status.network.unknown');
    }
}

export function getStatusBadgeColor(user) {
    const currentTimestamp = Math.floor(Date.now() / 1000); // fix to ms
    const timeTo = 300;

    const timestamps = [
        user.batteryStatus?.timestamp,
        user.latitude?.timestamp,
        user.longitude?.timestamp,
        user.networkStatus?.timestamp,
        user.screenLockStatus?.timestamp
    ].filter(Boolean);

    if (timestamps.length === 0) return "#e11025";

    const isFresh = (ts) => (currentTimestamp - ts) < timeTo;

    const allFresh = timestamps.every(isFresh);
    const someFresh = timestamps.some(isFresh);

    if (allFresh) return "#1bb23e";
    if (someFresh) return "#ffc107";
    return "#e11025";
}