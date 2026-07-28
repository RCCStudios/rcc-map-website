import { useState } from "react";
import { Menu, ChevronLeft, Search, Lock, Unlock, Battery, Network } from "lucide-react";
import { getStatusBadgeColor, formatNetworkStatus } from "../utils/formatters";
import { useTranslation } from "react-i18next";

export default function Sidebar({ users, onSelectUser }) {
    const { t, i18n } = useTranslation();

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: "absolute",
                    top: "16px",
                    left: isOpen ? "316px" : "16px",
                    zIndex: 1000,
                    background: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    color: "#333"
                }}
            >
                {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>

            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "300px",
                height: "100%",
                backgroundColor: "white",
                zIndex: 999,
                boxShadow: "2px 0 12px rgba(0,0,0,0.08)",
                transform: isOpen ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                padding: "16px",
                boxSizing: "border-box"
            }}>
                <h2 style={{ margin: "0 0 16px 0", fontSize: "20px" }}>{t('sidebar.title')}: ({users.length})</h2>

                <div style={{ position: "relative", marginBottom: "16px" }}>
                    <Search size={16} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#999" }} />
                    <input 
                        type="text" 
                        placeholder={t('sidebar.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "8px 12px 8px 34px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            outline: "none",
                            fontSize: "14px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {filteredUsers.map(user => {
                        const badgeColor = getStatusBadgeColor(user);
                        const hasCoords = user.latitude?.value && user.longitude?.value;

                        return (
                            <div 
                                key={user.id}
                                onClick={() => hasCoords && onSelectUser([user.latitude.value, user.longitude.value])}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    border: "1px solid #eee",
                                    cursor: hasCoords ? "pointer" : "not-allowed",
                                    opacity: hasCoords ? 1 : 0.5,
                                    backgroundColor: "#f9f9f9",
                                    transition: "background 0.2s"
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{ position: "relative", width: "32px", height: "32px" }}>
                                        <div style={{
                                            backgroundColor: "white",
                                            border: "2px solid black",
                                            borderRadius: "50%",
                                            width: "30px",
                                            height: "30px",
                                            overflow: "hidden",
                                            boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontWeight: "bold",
                                        }}>
                                            {user.pfpPath 
                                                ? <img src={user.pfpPath} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                : (user.name ? user.name.charAt(0).toUpperCase() : "?")
                                            }
                                        </div>
                                        <div style={{
                                            position: "absolute",
                                            bottom: "-3px",
                                            right: "-3px",
                                            border: "1px solid black",
                                            borderRadius: "50%",
                                            width: "8px",
                                            height: "8px",
                                            backgroundColor: badgeColor
                                        }} />
                                    </div>

                                    <div>
                                        <div style={{ fontWeight: "bold", fontSize: "14px", color: "#333" }}>
                                            {user.name}
                                        </div>
                                        <div style={{
                                            fontSize: "12px",
                                            color: `${user.screenLock?.value ? "#495057" : "#0ca678"}`,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px"
                                        }}>
                                            {user.screenLock?.value 
                                                ? <><Lock size={12} /> {t('status.screen_lock.locked')}</> 
                                                : <><Unlock size={12} color="#10b981" /> {t('status.screen_lock.unlocked')}</>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    gap: "4px",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "#475569"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                        <Battery size={14} />
                                        {user.batteryLevel?.value ?? "N/A"}%
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                        <Network size={14} />
                                        {formatNetworkStatus(user.network?.value, t)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}