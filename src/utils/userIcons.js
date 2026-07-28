import L from "leaflet"
import { getStatusBadgeColor } from "./formatters";

export function createUserIcon(user) {
    const avatarPath = user.pfpPath || null;
    const batteryLevel = user.batteryLevel?.value || 0;
    const networkStatus = user.network?.value || 0;
    const screenLockStatus = user.screenLock?.value || true;

    const badgeColor = getStatusBadgeColor(user);

    const html = `
      <div style="position: relative; width: 40px; height: 40px;">
        <div style="
          background-color: white;
          border: 2px solid black;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          overflow: hidden;
          box-shadow: 0 3px 6px rgba(0,0,0,0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
        ">
          ${avatarPath ?
              `<img src="${avatarPath}" style="width: 100%; height: 100%; object-fit: cover;" />` :
              ( user.name ? user.name.charAt(0).toUpperCase() : "?" )
          }
        </div>
        <div style="
          position: absolute;
          bottom: -5px;
          right: -5px;
          border: 1px solid black;
          border-radius: 50%;
          width: 10px;
          height: 10px;
          background-color: ${badgeColor};
        "></div>
      </div>
    `;
    return L.divIcon({
      html: html,
      className: "custom-div-icon",
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22]
    });
  }