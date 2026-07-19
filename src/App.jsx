import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const CENTER_POSITION = [
  Number(import.meta.env.VITE_CENTER_LAT),
  Number(import.meta.env.VITE_CENTER_LON)
];

const MAPTILER_KEY = '7tUeZnzzL7AZQMNHuyuT';
const DARK_MAP_ID = '019f7bd8-7d1b-7a94-be20-071acedc8033';
const LIGHT_MAP_ID = '019f7bd9-903b-7e42-b37f-856a42eeb704';

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
  const tileUrl = `https://api.maptiler.com/maps/${mapId}/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`;

  const baseUrl = window.location.hostname
  const [token, setToken] = useState(null)
  const [inputToken, setInputToken] = useState('')
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

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
        setUsers(data)
      } catch (e) {
        setError(e)
      }
    }
    getTelemetry()
  }, [token])

  useEffect(() => {
    if (!token) return;

    const wsUrl = `wss://${baseUrl}/api/ws`;
    const socket = new WebSocket(wsUrl, [`bearer.${token}`]);

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

    socket.onerror = (e) => { setError(e) }

    return () => {
      socket.close()
    };
  }, [token])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setToken(inputToken)
  } 

  if (!token) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
        <form onSubmit={handleLogin} style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <h2>Welcome to RCC Map</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="text" 
              placeholder="token" 
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
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
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          key={isDarkMode ? 'dark' : 'light'}
          attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={tileUrl}
        />
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
