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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Hello World
        </h1>
        <p className="text-gray-600 mb-4">
          Welcome to the Jones County Cross Country application!
        </p>
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <p className="text-green-800 font-medium">{message}</p>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          <p>Frontend: React + Vite + Tailwind CSS</p>
          <p>Backend: Go HTTP Server</p>
        </div>
      </div>
    </div>
  )
}

export default App
