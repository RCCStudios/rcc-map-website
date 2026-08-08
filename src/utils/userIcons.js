import L from "leaflet"
import { getStatusBadgeColor } from "./formatters";

export function createUserIcon(user) {
  const avatarPath = user.avatarPath || null;

  const badgeColor = getStatusBadgeColor(user);

  const html = `
    <div style="position: relative; width: 40px; height: 40px;">
      <div style="
        background-color: var(--color-bg-canvas);
        border: 2px solid var(--color-text-main);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        overflow: hidden;
        box-shadow: 0 3px 6px rgba(0,0,0,0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 20px;
      ">
        ${avatarPath ? `
          <img 
            src="${avatarPath}" 
            style="width: 100%; height: 100%; object-fit: cover; display: block;" 
            onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';"
          />
        ` : ''}
        
        <div style="
          width: 100%;
          height: 100%;
          display: ${avatarPath ? 'none' : 'flex'};
          justify-content: center;
          align-items: center;
          font-weight: bold;
          font-size: 20px;
          color: var(--color-text-main);
          background-color: var(--color-bg-surface);
        ">
          ${user.name ? user.name.charAt(0).toUpperCase() : "?"}
        </div>
      </div>
      <div style="
        position: absolute;
        bottom: -5px;
        right: -5px;
        border: 1px solid var(--color-text-main);
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

export function createClusterIcon(cluster) {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `<div class="custom-cluster-marker"><span>${count}</span></div>`,
    className: "custom-cluster-wrapper",
    iconSize: L.point(42, 42, true),
  });
};