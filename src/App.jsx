import { useState, useEffect, use } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import VectorTileLayer from './VectorTileLayer'

const CENTER_POSITION = [
  Number(import.meta.env.VITE_CENTER_LAT) || 0.0,
  Number(import.meta.env.VITE_CENTER_LON) || 0.0
];

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY
const DARK_MAP_ID = import.meta.env.VITE_DARK_MAP_ID
const LIGHT_MAP_ID = import.meta.env.VITE_LIGHT_MAP_ID

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => 
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDark(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDark;
}

function App() {
  const isDarkMode = useDarkMode();
  const mapId = isDarkMode ? DARK_MAP_ID : LIGHT_MAP_ID;
  const styleUrl = `https://api.maptiler.com/maps/${mapId}/style.json?key=${MAPTILER_KEY}`;

  const baseUrl = window.location.host
  // const [token, setToken] = useState(null)
  // const [inputToken, setInputToken] = useState('')
  const [otp, setOtp] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('otp') || null;
  })
  const [inputOtp, setInputOtp] = useState('')
  const [token, setToken] = useState(null)
  const [users, setUsers] = useState([])
  const [logMessage, setLogMessage] = useState('')

  useEffect(() => {
    if (!token) return;
    
    const getTelemetry = async () => {
      try {
        const url = `https://${baseUrl}/api/getTelemetry`
        const response = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        const data = await response.json()
        setLogMessage("Successfully got telemetry from server")
        setUsers(data)
      } catch (e) {
        setLogMessage(`Get Telemetry Error: ${e}`)
      }
    }
    getTelemetry()
  }, [token])

  useEffect(() => {
    if (!otp) return;
    
    const getToken = async () => {
      try {
        const url = `https://${baseUrl}/api/getToken`
        const response = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${otp}`
          }
        })
        const data = await response.json()
        setLogMessage("Successfully got token from server")
        setToken(data)
      } catch (e) {
        setLogMessage(`Get OTP Error: ${e}`)
      }
    }
    getToken()
  }, [otp])

  useEffect(() => {
    if (!token) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'

    const cleanToken = token.trim();

    const wsUrl = `${protocol}://${baseUrl}/api/${protocol}`;
    const socket = new WebSocket(wsUrl, [`bearer.${cleanToken}`]);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setUsers((prevUsers) => {
        return prevUsers.map((user) => {
          if (user.id !== data.id) return user
          return {
            ...user,
            batteryLevel: data.batteryLevel !== undefined
              ? { ...user.batteryLevel, value: data.batteryLevel }
              : user.batteryLevel,

            network: data.network !== undefined
              ? { ...user.network, value: data.network }
              : user.network,

            screenLock: data.screenLock !== undefined
              ? { ...user.screenLock, value: data.screenLock }
              : user.screenLock,

            latitude: data.latitude !== undefined
              ? { ...user.latitude, value: data.latitude }
              : user.latitude,

            longitude: data.longitude !== undefined
              ? { ...user.longitude, value: data.longitude }
              : user.longitude,
          }
        })
      })
    }

    socket.onerror = (e) => { setLogMessage(`WS Error: ${e}`) }

    return () => {
      socket.close()
    };
  }, [token])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLogMessage('')
    setOtp(inputOtp)
  } 

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
    )
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
          .filter(friend => friend.latitude?.value && friend.longitude?.value)
          .map(friend => (
            <Marker key={friend.id} position={[friend.latitude.value, friend.longitude.value]}>
              <Popup>
                <div>
                  <h3>{friend.name}</h3>
                  <p>🔋 Battery: {friend.batteryLevel?.value}%</p>
                  <p>🌐 Network: {friend.network?.value}</p>
                  <p>🔒 Screen Lock: {friend.screenLock?.value}</p>
                </div>
              </Popup>
            </Marker>
          ))
        }
      </MapContainer>
    </div>
  )
}

export default App
