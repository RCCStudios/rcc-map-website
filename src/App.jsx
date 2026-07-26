import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import VectorTileLayer from './VectorTileLayer'

const CENTER_POSITION = [
  Number(import.meta.env.VITE_CENTER_LAT) || 0.0,
  Number(import.meta.env.VITE_CENTER_LON) || 0.0
];

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;
const DARK_MAP_ID = import.meta.env.VITE_DARK_MAP_ID;
const LIGHT_MAP_ID = import.meta.env.VITE_LIGHT_MAP_ID;

function formatUnixTimestamp(unixTimestamp) {
  if (!unixTimestamp) return 'N/A';
  var date = new Date(unixTimestamp * 1000);
  var day = String(date.getDate()).padStart(2, '0');
  var month = String(date.getMonth() + 1).padStart(2, '0');
  var year = date.getFullYear();

  var hours = String(date.getHours()).padStart(2, '0');
  var minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => 
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => setIsDark(e.matches)

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, []);

  return isDark;
}

function App() {
  const isDarkMode = useDarkMode();
  const mapId = isDarkMode ? DARK_MAP_ID : LIGHT_MAP_ID;
  const styleUrl = `https://api.maptiler.com/maps/${mapId}/style.json?key=${MAPTILER_KEY}`;

  const baseUrl = window.location.host;
  const [otp, setOtp] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('otp') || null;
  });
  const [inputOtp, setInputOtp] = useState('');
  const [token, setToken] = useState(null);
  const [users, setUsers] = useState([]);
  const [logMessage, setLogMessage] = useState('');

  useEffect(() => {
    if (!otp) return;
    
    const getToken = async () => {
      try {
        const url = "/api/getToken" //`https://${baseUrl}/api/getToken`;
        const response = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${otp}`
          }
        });
        const data = await response.json();
        setLogMessage("Successfully got token from server");
        setToken(data.token);
      } catch (e) {
        setLogMessage(`Get OTP Error: ${e}`);
      }
    }
    getToken();
  }, [otp]);

  useEffect(() => {
    if (!token) return;
    
    const getTelemetry = async () => {
      try {
        const url = "api/getTelemetry" //`https://${baseUrl}/api/getTelemetry`;
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

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

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
    setLogMessage('');
    setOtp(inputOtp);
  };

  if (!otp || !token) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
        <form onSubmit={handleLogin} style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h2>Welcome to RCC Map</h2>
          {logMessage && <p style={{ color: logMessage.includes("Error") ? "red" : "blue", textAlign: 'center', maxWidth: '256px' }}>{logMessage}</p>}
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="text" 
              placeholder="Enter OTP" 
              value={inputOtp}
              onChange={(e) => setInputOtp(e.target.value)}
              style={{ padding: '8px', width: '200px' }}
              required 
            />
          </div>
          <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Login</button>
        </form>
      </div>
    );
  };

  const getStatusBadgeColor = (user) => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timeTo = 300;

    const timestamps = [
      user.batteryLevel?.timestamp,
      user.latitude?.timestamp,
      user.longitude?.timestamp,
      user.network?.timestamp,
      user.screenLock?.timestamp
    ].filter(Boolean);

    if (timestamps.length === 0) return "#e11025";

    const isFresh = (ts) => (currentTimestamp - ts) < timeTo;

    const allFresh = timestamps.every(isFresh);
    const someFresh = timestamps.some(isFresh);

    if (allFresh) return "#1bb23e";
    if (someFresh) return "#ffc107";
    return "#e11025";
  }

  const createUserIcon = (user) => {
    const avatarPath = user.pfpPath || null;
    const batteryLevel = user.batteryLevel?.value || 0;
    const networkStatus = user.network?.value || 0;
    const screenLockStatus = user.screenLock?.value || true;

    const badgeColor = getStatusBadgeColor(user);

    const html = `
      <div style="position: relative; width: 40px; height: 40px;">
        <div style="
          background-color: white;
          border: 2px solid black;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          overflow: hidden;
          box-shadow: 0 3px 6px rgba(0,0,0,0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
        ">
          ${avatarPath ?
              `<img src="${avatarPath}" style="width: 100%; height: 100%; object-fit: cover;" />` :
              ( user.name ? user.name.charAt(0).toUpperCase() : '?' )
          }
        </div>
        <div style="
          position: absolute;
          bottom: -5px;
          right: -5px;
          border: 1px solid black;
          border-radius: 50%;
          width: 10px;
          height: 10px;
          background-color: ${badgeColor};
        "></div>
      </div>
    `;
    return L.divIcon({
      html: html,
      className: "custom-div-icon",
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22]
    });
  }

  return (
    <div style={{ height: "100vh", width: "100vw"}}>
      <MapContainer
        center={CENTER_POSITION}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <VectorTileLayer key={isDarkMode ? 'dark' : 'light'} styleUrl={styleUrl} />
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
                <Popup>
                  <div>
                    <h3>{user.name}</h3>
                    <p>🔋 Battery: {user.batteryLevel?.value}%</p>
                    <p>{formatUnixTimestamp(user.batteryLevel?.timestamp)}</p>
                    <p>🌐 Network: {user.network?.value}</p>
                    <p>{formatUnixTimestamp(user.network?.timestamp)}</p>
                    <p>🔒 Screen Lock: {user.screenLock?.value}</p>
                    <p>{formatUnixTimestamp(user.screenLock?.timestamp)}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })
        }
      </MapContainer>
    </div>
  );
};

export default App