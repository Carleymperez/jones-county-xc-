import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    // Test API connection
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setMessage(data.message || 'Connected to backend!'))
      .catch(() => setMessage('Frontend is running! (Backend not connected)'))
  }, [])

  return (
    <div className="min-h-screen bg-blue-800 flex flex-col items-center justify-center text-white">
      {/* Logo placeholder */}
      <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center mb-8 shadow-lg">
        <span className="text-blue-800 text-3xl font-bold">JC</span>
      </div>

      {/* Hero heading */}
      <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400 text-center mb-4">
        Jones County Cross Country
      </h1>
      <p className="text-blue-200 text-lg text-center max-w-md mb-12">
        Building endurance, character, and team pride — one mile at a time.
      </p>

      {/* Backend status */}
      <div className="mt-auto pb-6 text-sm text-blue-300 opacity-75">
        <p>{message}</p>
      </div>
    </div>
  )
}

export default App
