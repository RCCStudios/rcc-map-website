import { useState, useEffect } from "react"
import { MapContainer, Marker, ZoomControl } from "react-leaflet"
import "leaflet/dist/leaflet.css"

import VectorTileLayer from "./components/VectorTileLayer"
import Sidebar from "./components/Sidebar"
import UserPopup from "./components/UserPopup"
import MapFlyController from "./components/MapFlyController"

import { useDarkMode } from "./hooks/useDarkMode"
import { createUserIcon } from "./utils/userIcons"

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
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f0f2f5" }}>
        <form onSubmit={handleLogin} style={{ padding: "20px", background: "white", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <h2>Welcome to RCC Map</h2>
          {logMessage && <p style={{ color: logMessage.includes("Error") ? "red" : "blue", textAlign: "center", maxWidth: "256px" }}>{logMessage}</p>}
          <div style={{ marginBottom: "15px" }}>
            <input 
              type="text" 
              placeholder="Enter OTP" 
              value={inputOtp}
              onChange={(e) => setInputOtp(e.target.value)}
              style={{ padding: "8px", width: "200px" }}
              required 
            />
          </div>
          <button type="submit" style={{ padding: "8px 16px", cursor: "pointer" }}>Login</button>
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