import { useState, useEffect } from "react";
import { MapContainer, Marker, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import VectorTileLayer from "./components/VectorTileLayer";
import Sidebar from "./components/Sidebar";
import UserPopup from "./components/UserPopup";
import MapFlyController from "./components/MapFlyController";
import Login from "./components/Login"

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
        const url = "/api/token" // `https://${baseUrl}/api/getToken`;
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
        const url = "/api/telemetry" // `https://${baseUrl}/api/getTelemetry`;
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
            batteryStatus: data.batteryStatus !== undefined
              ? {
                ...user.batteryStatus,
                timestamp: currentTimestamp,
                value: data.batteryStatus
              }
              : user.batteryStatus,

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

            networkStatus: data.networkStatus !== undefined
              ? {
                ...user.networkStatus,
                timestamp: currentTimestamp,
                value: data.networkStatus
              }
              : user.networkStatus,

            screenLockStatus: data.screenLockStatus !== undefined
              ? {
                ...user.screenLockStatus,
                timestamp: currentTimestamp,
                value: data.screenLockStatus
              }
              : user.screenLockStatus,
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
      <Login
        handleLogin={handleLogin}
        inputOtp={inputOtp}
        setInputOtp={setInputOtp}
        logMessage={logMessage}
      />
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
                key={`${user.id}-${user.batteryStatus?.value}-${user.networkStatus?.value}-${user.screenLockStatus?.value}`}
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