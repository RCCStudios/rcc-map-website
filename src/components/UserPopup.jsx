import { Popup } from "react-leaflet";
import { Menu, ChevronLeft, Search, Lock, Unlock, Battery, Network } from "lucide-react";
import { formatUnixTimestamp, formatNetworkStatus } from "../utils/formatters";
import { useTranslation } from "react-i18next";

export default function UserPopup({ user }) {
    const { t, i18n } = useTranslation();

    return ( 
        <Popup className="custom-popup">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", paddingTop: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold", color: "#111" }}>
                    {user.name}
                </h3>
            </div>
            <div style={{ paddingBottom: "8px", display: "flex", flex: "row", justifyContent: "space-between", alignItems: "center", gap: "6px" }}>
                <span style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    gap: "4px",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: user.screenLock?.value ? "#f1f3f5" : "#e6fcf5",
                    color: user.screenLock?.value ? "#495057" : "#0ca678",
                    border: `1px solid ${user.screenLock?.value ? "#ced4da" : "#96f2d7"}`
                }}>
                    {user.screenLock?.value
                        ? <><Lock size={12} />{t('status.screen_lock.locked')}</>
                        : <><Lock size={12} />{t('status.screen_lock.unlocked')}</>
                    }
                </span>
                <div style={{ fontSize: "10px", color: "#888" }}>
                    {formatUnixTimestamp(user.screenLock?.timestamp)}
                </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "8px 0" }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", color: "#555", display: "flex", alignItems: "center", gap: "4px", paddingRight: "8px" }}>
                    <Battery size={16} />
                    {t('status.battery')}
                </span>
                <div style={{ textAlign: "right" }}>
                    <span style={{ 
                        fontSize: "13px", 
                        fontWeight: "bold", 
                        color: user.batteryLevel?.value < 20 ? "#c4192a" : ( user.batteryLevel?.value > 80 ? "#20a13e" : "#ddaa12" ) 
                    }}>
                        {user.batteryLevel?.value ?? "N/A"}%
                    </span>
                    <div style={{ fontSize: "10px", color: "#888" }}>
                        {formatUnixTimestamp(user.batteryLevel?.timestamp)}
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "#555", display: "flex", alignItems: "center", gap: "4px", paddingRight: "8px" }}>
                    <Network size={16} />
                    {t('status.network.title')}
                </span>
                <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "13px", fontWeight: "bold", color: "#333" }}>
                    {formatNetworkStatus(user.network?.value, t) ?? t('status.network.unknown')}
                    </span>
                    <div style={{ fontSize: "10px", color: "#888" }}>
                    {formatUnixTimestamp(user.network?.timestamp)}
                    </div>
                </div>
            </div>
        </Popup>
    );
}