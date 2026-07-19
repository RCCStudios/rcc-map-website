import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const CENTER_POSITION = [
  Number(import.meta.env.VITE_CENTER_LAT),
  Number(import.meta.env.VITE_CENTER_LON)
];

function App() {
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
              ? { ...user.latitude, value: data.lat }
              : user.latitude,

            longitude: data.longitude !== undefined
              ? { ...user.longitude, value: data.lon }
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {users.map(friend => (
          <Marker key={friend.id} position={[friend.latitude?.value, friend.longitude?.value]}>
            <Popup>
              <div>
              <h3>{friend.name}</h3>
              <p>🔋 Battery: {friend.batteryStatus?.value}%</p>
              <p>🌐 Network: {friend.networkStatus?.value}</p>
              <p>🔒 Screen Lock: {friend.screenLockStatus?.value}</p>
            </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default App
