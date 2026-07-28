import { useState } from "react";
import { getStatusBadgeColor } from "../utils/formatters";

export default function Sidebar({ users, onSelectUser }) {
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
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "8px 12px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                transition: "left 0.3s ease",
                fontWeight: "bold"
                }}
            >
                {isOpen ? "◀" : "☰"}
            </button>

            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "300px",
                height: "100%",
                backgroundColor: "white",
                zIndex: 999,
                boxShadow: "2px 0 12px rgba(0,0,0,0.15)",
                transform: isOpen ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.3s ease",
                display: "flex",
                flexDirection: "column",
                padding: "16px",
                boxSizing: "border-box"
            }}>
                <h2 style={{ margin: "0 0 16px 0", fontSize: "20px" }}>Users: ({users.length})</h2>

                <input 
                    type="text" 
                    placeholder="Search user..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        marginBottom: "16px",
                        outline: "none"
                    }}
                />

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
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "50%",
                                            backgroundColor: "#e0e0e0",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            overflow: "hidden",
                                            fontWeight: "bold",
                                            fontSize: "14px"
                                        }}>
                                            {user.pfpPath 
                                                ? <img src={user.pfpPath} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                : (user.name ? user.name.charAt(0).toUpperCase() : "?")
                                            }
                                        </div>
                                        <div style={{
                                            position: "absolute",
                                            bottom: "-2px",
                                            right: "-2px",
                                            width: "8px",
                                            height: "8px",
                                            borderRadius: "50%",
                                            backgroundColor: badgeColor,
                                            border: "1px solid white"
                                        }} />
                                    </div>

                                    <div>
                                        <div style={{ fontWeight: "bold", fontSize: "14px", color: "#333" }}>
                                            {user.name}
                                        </div>
                                        <div style={{ fontSize: "11px", color: "#777" }}>
                                            {user.screenLock?.value ? "🔒 Locked" : "🔓 Unlocked"}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ textAlign: "right", fontSize: "12px", fontWeight: "bold", color: "#555" }}>
                                    🔋 {user.batteryLevel?.value ?? "N/A"}%
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}