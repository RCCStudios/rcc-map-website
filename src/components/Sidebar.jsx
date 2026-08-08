import { useState } from "react";
import { Menu, ChevronLeft, Search, Lock, Unlock, Battery, Network, Sun, Moon } from "lucide-react";
import { getStatusBadge, getStatusBadgeColor, formatNetworkStatus } from "../utils/formatters";
// import { useDarkMode } from "../hooks/useDarkMode";
import { useTranslation } from "react-i18next";
import "./Sidebar.css"

export default function Sidebar({ users, onSelectUser, isDarkMode, toggleTheme }) {
    const { t, i18n } = useTranslation()
    const toggleLanguage = () => {
        const currentLang = i18n.language?.split('-')[0] || 'ru'
        i18n.changeLanguage(currentLang === 'ru' ? 'en' : 'ru')
    };

    // const { isDarkMode, toggleTheme } = useDarkMode()

    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const filteredUsers = users
        .reduce((acc, user) => {
            if (user.name?.toLowerCase().includes(searchTerm)) {
                acc.push({ user, status: getStatusBadge(user) })
            }
            return acc
        }, [])
        .sort((a, b) => b.status - a.status)
        .map(item => item.user)

    const handleSelectUser = (coords) => {
        if (!coords) return
        onSelectUser(coords)
        if (window.innerWidth <= 640) {
            setIsOpen(false)
        }
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`sidebar-toggle-btn ${isOpen ? 'open' : ''}`}
            >
                {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>

            <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-title">{t('sidebar.title')}: ({users.length})</h2>

                    <div className="sidebar-actions">
                        <button 
                            type="button" 
                            onClick={toggleLanguage}
                            className="sidebar-btn-lang"
                        >
                            {(i18n.language?.split('-')[0] || 'ru').toUpperCase()}
                        </button>
                        <button
                            type="button" 
                            onClick={toggleTheme}
                            className="sidebar-btn-theme"
                        >
                            { isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </div>

                <div className="sidebar-search-wrapper">
                    <Search size={16} className="sidebar-search-icon" />
                    <input 
                        type="text" 
                        placeholder={t('sidebar.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="sidebar-search-input"
                    />
                </div>

                <div className="sidebar-user-list">
                    {filteredUsers.map(user => {
                        const badgeColor = getStatusBadgeColor(user);
                        const hasCoords = user.latitude?.value && user.longitude?.value;

                        return (
                            <div 
                                key={user.id}
                                onClick={() => hasCoords && handleSelectUser([user.latitude.value, user.longitude.value])}
                                className={`user-card ${hasCoords ? 'clickable' : 'disabled'}`}
                            >
                                <div className="user-card-main">
                                    <div className="user-avatar-wrapper">
                                        <div className="user-avatar">
                                            {user.avatarPath && (
                                                <img 
                                                    src={user.avatarPath} 
                                                    alt={user.name || "Avatar"}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        if (e.currentTarget.nextElementSibling) {
                                                            e.currentTarget.nextElementSibling.style.display = 'flex';
                                                        }
                                                    }}
                                                />
                                            )}
                                            
                                            <div style={{ 
                                                display: user.avatarPath ? 'none' : 'flex',
                                                width: '100%',
                                                height: '100%',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                fontSize: '16px'
                                            }}>
                                                {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                                            </div>
                                        </div>
                                        <div 
                                            className="user-status-dot"
                                            style={{ backgroundColor: badgeColor }} 
                                        />
                                    </div>

                                    <div>
                                        <div className="user-name">{user.name}</div>
                                        <div className={`user-lock-status ${user.screenLockStatus?.value ? 'locked' : 'unlocked'}`}>
                                            {user.screenLockStatus?.value 
                                                ? <><Lock size={12} /> {t('status.screen_lock.locked')}</> 
                                                : <><Unlock size={12} color="#10b981" /> {t('status.screen_lock.unlocked')}</>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="user-card-metrics">
                                    <div className="metric-item">
                                        <Battery size={14} />
                                        {user.batteryStatus?.value ?? "N/A"}%
                                    </div>
                                    <div className="metric-item">
                                        <Network size={14} />
                                        {formatNetworkStatus(user.networkStatus?.value, t)}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    );
}