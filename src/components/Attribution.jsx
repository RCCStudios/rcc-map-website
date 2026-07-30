import React from "react";

export default function Attribution() {
    const containerStyle = {
        position: "absolute",
        bottom: "0",
        right: "0",
        zIndex: "1000",
        background: "rgb(from var(--color-bg-surface) r g b / 0.75)",
        padding: "2px 8px",
        fontSize: "11px",
        color: "#333",
        borderTopLeftRadius: "4px",
        display: "flex",
        gap: "5px",
        pointerEvents: "auto",
    };

    const linkStyle = {
        color: "var(--color-text-main)",
        textDecoration: "none",
    };

    return (
        <div style={containerStyle} className="custom-attribution">
        <a href="https://leafletjs.com" target="_blank" rel="noreferrer" style={linkStyle}>
            Leaflet
        </a>
        <span>|</span>
        <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noreferrer" style={linkStyle}>
            © MapTiler
        </a>
        <span>|</span>
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" style={linkStyle}>
            © OSM
        </a>
        </div>
    );
}