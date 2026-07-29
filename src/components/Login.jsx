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
            background: "radial-gradient(circle at center, var(--color-brand-main) 0%, var(--color-bg-surface) 100%)",
            fontFamily: "system-ui, -apple-system, sans-serif"
        }}>
            <form 
                onSubmit={handleLogin} 
                style={{
                    background: "var(--color-bg-canvas)",
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
                        style={{ 
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid var(--color-text-muted)',
                            background: 'var(--color-bg-canvas)',
                            cursor: 'pointer', 
                            fontWeight: '600', 
                            fontSize: '12px',
                            color: 'var(--color-text-muted)',
                            transition: 'all 0.2s ease',
                            outline: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-brand-main)';
                            e.currentTarget.style.background = 'var(--color-bg-surface)';
                            e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-brand-muted)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-text-muted)';
                            e.currentTarget.style.background = 'var(--color-bg-canvas)';
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        {(i18n.language?.split('-')[0] || 'ru').toUpperCase()}
                    </button>
                </div>
                
                <div style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "12px",
                    background: "var(--color-bg-surface)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    color: "var(--color-text-main)"
                }}>
                    <img 
                        src="/rcc_map.svg" 
                        alt="RCC Logo" 
                        style={{ width: "48px", height: "48px" }} 
                    />
                </div>

                <h2 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: "700", color: "var(--color-text-main)", textAlign: "center" }}>
                    {t('login.title')}
                </h2>
                <p style={{ margin: "0 0 24px 0", fontSize: "13px", color: "var(--color-text-muted)", textAlign: "center" }}>
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
                            border: "1px solid var(--color-text-muted)",
                            outline: "none",
                            fontSize: "14px",
                            boxSizing: "border-box",
                            transition: "border-color 0.2s, box-shadow 0.2s",
                            backgroundColor: "var(--color-bg-surface)"
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = "var(--color-brand-main)";
                            e.target.style.boxShadow = "0 0 0 3px var(--color-brand-muted)";
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = "var(--color-text-muted)";
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
                        background: "var(--color-text-main)",
                        color: "var(--color-bg-surface)",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        transition: "background 0.2s, transform 0.1s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-brand-muted)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
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