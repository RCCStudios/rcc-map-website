import { useState } from "react";
import { Menu, ChevronLeft, Search, Lock, Unlock, Battery, Network, Sun, Moon } from "lucide-react";
import { getStatusBadgeColor, formatNetworkStatus } from "../utils/formatters";
// import { useDarkMode } from "../hooks/useDarkMode";
import { useTranslation } from "react-i18next";

export default function Sidebar({ users, onSelectUser, isDarkMode, toggleTheme }) {
    const { t, i18n } = useTranslation();
    const toggleLanguage = () => {
        const currentLang = i18n.language?.split('-')[0] || 'ru';
        i18n.changeLanguage(currentLang === 'ru' ? 'en' : 'ru');
    };

    // const { isDarkMode, toggleTheme } = useDarkMode();

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
                    left: isOpen ? "416px" : "16px",
                    zIndex: 1000,
                    background: "var(--color-bg-surface)",
                    border: "1px solid var(--color-bg-canvas)",
                    borderRadius: "8px",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    color: "var(--color-text-main)"
                }}
            >
                {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>

            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "400px",
                height: "100%",
                backgroundColor: "var(--color-bg-canvas)",
                zIndex: 999,
                boxShadow: "2px 0 12px rgba(0,0,0,0.08)",
                transform: isOpen ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                padding: "16px",
                boxSizing: "border-box"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px"
                }}>
                    <h2 style={{ margin: 0, fontSize: "20px", whiteSpace: "nowrap", color: "var(--color-text-main)" }}>{t('sidebar.title')}: ({users.length})</h2>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: "8px" }}>
                        <button 
                            type="button" 
                            onClick={toggleLanguage}
                            style={{ 
                                padding: '4px 8px',
                                borderRadius: '6px',
                                border: '1px solid var(--color-border-strong)',
                                backgroundColor: 'var(--color-bg-surface)',
                                cursor: 'pointer', 
                                fontWeight: '600', 
                                fontSize: '12px',
                                color: 'var(--color-text-muted)',
                                transition: 'all 0.2s ease',
                                outline: 'none'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-brand-main)';
                                e.currentTarget.style.color = 'var(--color-text-main)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-border-strong)';
                                e.currentTarget.style.color = 'var(--color-text-muted)';
                            }}
                        >
                            {(i18n.language?.split('-')[0] || 'ru').toUpperCase()}
                        </button>
                        <button
                            type="button" 
                            onClick={toggleTheme}
                            style={{ 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '8px',
                                borderRadius: '50%',
                                border: '1px solid var(--color-border-strong)',
                                backgroundColor: 'var(--color-bg-surface)',
                                cursor: 'pointer',
                                color: 'var(--color-text-muted)',
                                transition: 'all 0.2s ease',
                                outline: 'none'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-brand-main)';
                                e.currentTarget.style.color = 'var(--color-text-main)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-border-strong)';
                                e.currentTarget.style.color = 'var(--color-text-muted)';
                            }}
                        >
                            { isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </div>

                <div style={{ position: "relative", marginBottom: "16px" }}>
                    <Search size={16} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
                    <input 
                        type="text" 
                        placeholder={t('sidebar.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px 12px 10px 36px",
                            borderRadius: "10px",
                            border: "1px solid var(--color-border-strong)",
                            backgroundColor: "var(--color-bg-surface)",
                            outline: "none",
                            fontSize: "14px",
                            color: "var(--color-text-main)",
                            boxSizing: "border-box",
                            transition: "all 0.2s ease"
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = "var(--color-brand-main)";
                            e.target.style.backgroundColor = "var(--color-bg-canvas)";
                            e.target.style.boxShadow = "0 1px 3px var(--color-brand-muted)";
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = "var(--color-border-strong)";
                            e.target.style.backgroundColor = "var(--color-bg-surface)";
                            e.target.style.boxShadow = "none";
                        }}
                    />
                </div>

                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", paddingTop: "8px" }}>
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
                                    padding: "12px",
                                    borderRadius: "12px",
                                    border: "1px solid var(--color-border)",
                                    cursor: hasCoords ? "pointer" : "not-allowed",
                                    opacity: hasCoords ? 1 : 0.5,
                                    backgroundColor: "var(--color-bg-surface)",
                                    transition: "all 0.2s ease",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
                                }}
                                onMouseEnter={(e) => {
                                    if (!hasCoords) return;
                                    e.currentTarget.style.borderColor = 'var(--color-brand-main)';
                                    e.currentTarget.style.backgroundColor = 'var(--color-bg-canvas)';
                                    e.currentTarget.style.boxShadow = "0 4px 12px var(--color-brand-muted)";
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                }}
                                onMouseLeave={(e) => {
                                    if (!hasCoords) return;
                                    e.currentTarget.style.borderColor = 'var(--color-border)';
                                    e.currentTarget.style.backgroundColor = 'var(--color-bg-surface)';
                                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.03)";
                                    e.currentTarget.style.transform = "none";
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{ position: "relative", width: "32px", height: "32px" }}>
                                        <div style={{
                                            backgroundColor: "var(--color-bg-canvas)",
                                            border: "2px solid var(--color-text-main)",
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
                                            {user.avatarPath 
                                                ? <img src={user.avatarPath} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                : (user.name ? user.name.charAt(0).toUpperCase() : "?")
                                            }
                                        </div>
                                        <div style={{
                                            position: "absolute",
                                            bottom: "-3px",
                                            right: "-3px",
                                            border: "1px solid var(--color-text-main)",
                                            borderRadius: "50%",
                                            width: "8px",
                                            height: "8px",
                                            backgroundColor: badgeColor
                                        }} />
                                    </div>

                                    <div>
                                        <div style={{ fontWeight: "bold", fontSize: "14px", color: "var(--color-text-main)" }}>
                                            {user.name}
                                        </div>
                                        <div style={{
                                            fontSize: "12px",
                                            color: `${user.screenLockStatus?.value ? "#495057" : "#0ca678"}`,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px"
                                        }}>
                                            {user.screenLockStatus?.value 
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
                                    color: "var(--color-text-muted)"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                        <Battery size={14} />
                                        {user.batteryStatus?.value ?? "N/A"}%
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                        <Network size={14} />
                                        {formatNetworkStatus(user.networkStatus?.value, t)}
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