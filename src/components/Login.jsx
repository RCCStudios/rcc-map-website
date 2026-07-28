import { useTranslation } from 'react-i18next';
import { AlertCircle, CheckCircle2, LogIn } from 'lucide-react';

export default function Login({ handleLogin, inputOtp, setInputOtp, logMessage }) {
    const { t, i18n } = useTranslation();
    const isError = logMessage?.toLowerCase().includes("error");

    const toggleLanguage = () => {
        const currentLang = i18n.language?.split('-')[0] || 'ru';
        i18n.changeLanguage(currentLang === 'ru' ? 'en' : 'ru');
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
            background: "radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)",
            fontFamily: "system-ui, -apple-system, sans-serif"
        }}>
            <form 
                onSubmit={handleLogin} 
                style={{
                    background: "rgba(255, 255, 255, 0.98)",
                    backdropFilter: "blur(10px)",
                    padding: "32px 28px",
                    borderRadius: "16px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
                    width: "100%",
                    maxWidth: "360px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    boxSizing: "border-box"
                }}
            >
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                        type="button" 
                        onClick={toggleLanguage}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                    >
                        {(i18n.language?.split('-')[0] || 'ru').toUpperCase()}
                    </button>
                </div>
                
                <div style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "12px",
                    background: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    color: "#0f172a"
                }}>
                    <img 
                        src="/rcc_map.svg" 
                        alt="RCC Logo" 
                        style={{ width: "48px", height: "48px" }} 
                    />
                </div>

                <h2 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>
                    {t('login.title')}
                </h2>
                <p style={{ margin: "0 0 24px 0", fontSize: "13px", color: "#64748b", textAlign: "center" }}>
                    {t('login.subtitle')}
                </p>

                {logMessage && (
                    <div style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        marginBottom: "16px",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        boxSizing: "border-box",
                        background: isError ? "#fef2f2" : "#f0fdf4",
                        color: isError ? "#dc2626" : "#16a34a",
                        border: `1px solid ${isError ? "#fecaca" : "#bbf7d0"}`
                    }}>
                        {isError ? <AlertCircle size={16} style={{ flexShrink: 0 }} /> : <CheckCircle2 size={16} style={{ flexShrink: 0 }} />}
                        <span style={{ wordBreak: "break-word" }}>{logMessage}</span>
                    </div>
                )}

                <div style={{ width: "100%", marginBottom: "20px", position: "relative" }}>
                    <input 
                        type="text" 
                        placeholder={t('login.placeholder')}
                        value={inputOtp}
                        onChange={(e) => setInputOtp(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px 14px",
                            borderRadius: "10px",
                            border: "1px solid #cbd5e1",
                            outline: "none",
                            fontSize: "14px",
                            boxSizing: "border-box",
                            transition: "border-color 0.2s, box-shadow 0.2s",
                            backgroundColor: "#f8fafc"
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = "#2563eb";
                            e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.15)";
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = "#cbd5e1";
                            e.target.style.boxShadow = "none";
                        }}
                        required 
                    />
                </div>

                <button 
                    type="submit" 
                    style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "none",
                        background: "#0f172a",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        transition: "background 0.2s, transform 0.1s"
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
                    onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                    <LogIn size={16} />
                    {t('login.button')}
                </button>
            </form>
        </div>
    );
}