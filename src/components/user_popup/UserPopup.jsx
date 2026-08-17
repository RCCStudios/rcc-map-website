import { Popup } from "react-leaflet";
import { Lock, Unlock, Battery, Network, MapPin, Send, Bomb, RefreshCw } from "lucide-react";
import { formatUnixTimestamp, formatNetworkStatus } from "../../utils/formatters";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { forceTelemetry} from "../../api/forceTelemetry";
import { bomb } from "../../api/bomb";
import "./UserPopup.css";

export default function UserPopup({ token, user }) {
    const { t } = useTranslation();
    const [bombLoading, setBombLoading] = useState(false);
    const [telemetryLoading, setTelemetryLoading] = useState(false);


    const getBatteryColor = (value) => {
        if (value < 20) return "battery-low";
        if (value > 80) return "battery-high";
        return "battery-medium";
    };

    const handleBomb = async () => {
        if (bombLoading) return;
        setBombLoading(true);
        try {
            await bomb(token, user);
        } catch (e) {
            console.error(e);
        } finally {
            setBombLoading(false);
        }
    };

    const handleForceTelemetry = async () => {
        if (telemetryLoading) return;
        setTelemetryLoading(true);
        try {
            await forceTelemetry(token, user);
        } catch (e) {
            console.error(e);
        } finally {
            setTelemetryLoading(false);
        }
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

            <div className="user-popup-row">
                {user.telegram && (
                    <a 
                        href={`tg://resolve?domain=${user.telegram}`}
                        className="action-btn tg"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Send size={18} />
                    </a>
                )}

                <button className="action-btn bomb" onClick={handleBomb} disabled={bombLoading}>
                    <Bomb size={18} />
                </button>

                <button className="action-btn update" onClick={handleForceTelemetry} disabled={telemetryLoading}> 
                    <RefreshCw size={18} className={telemetryLoading ? "spin" : ""} />
                </button>
            </div>
        </Popup>
    );
}