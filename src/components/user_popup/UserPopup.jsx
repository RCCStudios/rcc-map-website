import { Popup } from "react-leaflet";
import { Lock, Unlock, Battery, Network, MapPin, Send } from "lucide-react";
import { formatUnixTimestamp, formatNetworkStatus } from "../../utils/formatters";
import { useTranslation } from "react-i18next";
import "./UserPopup.css";

export default function UserPopup({ user }) {
    const { t } = useTranslation();

    const getBatteryColor = (value) => {
        if (value < 20) return "battery-low";
        if (value > 80) return "battery-high";
        return "battery-medium";
    };

    return ( 
        <Popup className="custom-popup">
            <div className="user-popup-header">
                <h3 className="user-popup-title">{user.username}</h3>
                <div className="user-popup-timestamp">
                    <MapPin size={12} />
                    {formatUnixTimestamp(user.latitude?.timestamp)}
                </div>
            </div>

            <div className="user-popup-status-row">
                <span className={`user-popup-badge ${user.screenLockStatus?.value ? "locked" : "unlocked"}`}>
                    {user.screenLockStatus?.value ? (
                        <><Lock size={12} />{t('status.screen_lock.locked')}</>
                    ) : (
                        <><Unlock size={12} color="var(--color-brand-main)" />{t('status.screen_lock.unlocked')}</>
                    )}
                </span>
                <div className="user-popup-time">
                    {formatUnixTimestamp(user.screenLockStatus?.timestamp)}
                </div>
            </div>

            <hr className="user-popup-divider" />

            <div className="user-popup-row">
                <span className="user-popup-label">
                    <Battery size={16} />
                    {t('status.battery')}
                </span>
                <div className="user-popup-value-container">
                    <span className={`user-popup-value ${getBatteryColor(user.batteryStatus?.value)}`}>
                        {user.batteryStatus?.value ?? "N/A"}%
                    </span>
                    <div className="user-popup-time">
                        {formatUnixTimestamp(user.batteryStatus?.timestamp)}
                    </div>
                </div>
            </div>

            <div className="user-popup-row">
                <span className="user-popup-label">
                    <Network size={16} />
                    {t('status.network.title')}
                </span>
                <div className="user-popup-value-container">
                    <span className="user-popup-value">
                        {formatNetworkStatus(user.networkStatus?.value, t) ?? t('status.network.unknown')}
                    </span>
                    <div className="user-popup-time">
                        {formatUnixTimestamp(user.networkStatus?.timestamp)}
                    </div>
                </div>
            </div>

            <hr className="user-popup-divider" />
            
            {user.telegram && (
                <a 
                    href={`tg://resolve?domain=${user.telegram}`}
                    className="tg-action-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Send size={18} />
                </a>
            )}
        </Popup>
    );
}