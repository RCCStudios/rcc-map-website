import { useState, useEffect } from "react";
import { MapContainer, Marker, ZoomControl } from "react-leaflet";
import { KeyRound, LogIn, AlertCircle, CheckCircle2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

import VectorTileLayer from "./components/VectorTileLayer";
import Sidebar from "./components/Sidebar";
import UserPopup from "./components/UserPopup";
import MapFlyController from "./components/MapFlyController";

import { useDarkMode } from "./hooks/useDarkMode";
import { createUserIcon } from "./utils/userIcons";

const CENTER_POSITION = [
  Number(import.meta.env.VITE_CENTER_LAT) || 0.0,
  Number(import.meta.env.VITE_CENTER_LON) || 0.0
];

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;
const DARK_MAP_ID = import.meta.env.VITE_DARK_MAP_ID;
const LIGHT_MAP_ID = import.meta.env.VITE_LIGHT_MAP_ID;

function App() {
  const isDarkMode = useDarkMode();
  const mapId = isDarkMode ? DARK_MAP_ID : LIGHT_MAP_ID;
  const styleUrl = `https://api.maptiler.com/maps/${mapId}/style.json?key=${MAPTILER_KEY}`;

  const baseUrl = window.location.host;
  const [otp, setOtp] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("otp") || null;
  });
  const [inputOtp, setInputOtp] = useState("");
  const [token, setToken] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token") || null;
  });
  const [users, setUsers] = useState([]);
  const [logMessage, setLogMessage] = useState("");
  const [selectedCoords, setSelectedCoords] = useState(null);

  useEffect(() => {
    if (!otp) return;
    
    const getToken = async () => {
      try {
        const url = "/api/getToken" // `https://${baseUrl}/api/getToken`;
        const response = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${otp}`
          }
        });
        const data = await response.json();
        setLogMessage("Successfully got token from server");
        setToken(data.token);
      } catch (e) {
        setLogMessage(`Get Token Error: ${e}`);
      }
    }
    getToken();
  }, [otp]);

  useEffect(() => {
    if (!token) return;
    
    const getTelemetry = async () => {
      try {
        const url = "/api/getTelemetry" // `https://${baseUrl}/api/getTelemetry`;
        const response = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        setLogMessage("Successfully got telemetry from server");
        setUsers(data);
      } catch (e) {
        setLogMessage(`Get Telemetry Error: ${e}`);
      }
    }
    getTelemetry();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";

    const cleanToken = String(token).trim();
    const wsUrl = `${protocol}://${baseUrl}/api/${protocol}`;
    const socket = new WebSocket(wsUrl, [`bearer.${cleanToken}`]);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const currentTimestamp = Math.floor(Date.now() / 1000); // fix to ms
      setUsers((prevUsers) => {
        return prevUsers.map((user) => {
          if (user.id !== data.id) return user;
          return {
            ...user,
            batteryLevel: data.batteryLevel !== undefined
              ? {
                ...user.batteryLevel,
                timestamp: currentTimestamp,
                value: data.batteryLevel
              }
              : user.batteryLevel,

            latitude: data.latitude !== undefined
              ? {
                ...user.latitude,
                timestamp: currentTimestamp,
                value: data.latitude
              }
              : user.latitude,

            longitude: data.longitude !== undefined
              ? {
                ...user.longitude,
                timestamp: currentTimestamp,
                value: data.longitude
              }
              : user.longitude,

            network: data.network !== undefined
              ? {
                ...user.network,
                timestamp: currentTimestamp,
                value: data.network
              }
              : user.network,

            screenLock: data.screenLock !== undefined
              ? {
                ...user.screenLock,
                timestamp: currentTimestamp,
                value: data.screenLock
              }
              : user.screenLock,
          }
        });
      });
    };

    socket.onerror = (e) => { setLogMessage(`WS Error: ${e}`) };

    return () => {
      socket.close();
    };
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLogMessage("");
    setOtp(inputOtp);
  };

  if (!token) {
    const isError = logMessage.toLowerCase().includes("error");

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
            Welcome to RCC Map
          </h2>
          <p style={{ margin: "0 0 24px 0", fontSize: "13px", color: "#64748b", textAlign: "center" }}>
            Enter your OTP code to login
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
              placeholder="Enter OTP code" 
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
            Sign In
          </button>
        </form>
      </div>
    );
  };

  return (
    <div style={{ height: "100vh", width: "100vw"}}>
      <Sidebar users={users} onSelectUser={(coords) => setSelectedCoords(coords)} />

      <MapContainer
        center={CENTER_POSITION}
        zoom={14}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <ZoomControl position="topright" />
        <MapFlyController selectedCoords={selectedCoords} />
        <VectorTileLayer key={isDarkMode ? "dark" : "light"} styleUrl={styleUrl} />
        {users
          .filter(user => user.latitude?.value && user.longitude?.value)
          .map(user => {
            const customIcon = createUserIcon(user);

            return (
              <Marker
                key={`${user.id}-${user.batteryLevel?.value}-${user.network?.value}-${user.screenLock?.value}`}
                position={[user.latitude?.value, user.longitude?.value]}
                icon={customIcon}
              >
                <UserPopup user={user} />
              </Marker>
            );
          })
        }
      </MapContainer>
    </div>
  );
};

export default App