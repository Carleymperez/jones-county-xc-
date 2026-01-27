import { useState, useEffect } from 'react'

function App() {
  const [athletes, setAthletes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/athletes')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch athletes')
        return res.json()
      })
      .then(data => {
        setAthletes(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-blue-800 flex flex-col items-center text-white">
      {/* Header */}
      <div className="flex flex-col items-center mt-12 mb-10">
        <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center mb-6 shadow-lg">
          <span className="text-blue-800 text-2xl font-bold">JC</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400 text-center mb-2">
          Jones County Cross Country
        </h1>
        <p className="text-blue-200 text-lg text-center max-w-md">
          Building endurance, character, and team pride — one mile at a time.
        </p>
      </div>

      {/* Athletes roster */}
      <div className="w-full max-w-2xl px-4 pb-12">
        <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Athletes</h2>

        {loading && <p className="text-blue-200">Loading athletes...</p>}
        {error && <p className="text-red-300">Error: {error}</p>}

        {!loading && !error && (
          <div className="bg-blue-900 rounded-lg overflow-hidden shadow-lg">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-blue-950 text-yellow-400 text-sm uppercase tracking-wider">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Grade</th>
                  <th className="px-6 py-3">PR (5K)</th>
                </tr>
              </thead>
              <tbody>
                {athletes.map(athlete => (
                  <tr key={athlete.id} className="border-t border-blue-800 hover:bg-blue-800 transition-colors">
                    <td className="px-6 py-4 font-medium">{athlete.name}</td>
                    <td className="px-6 py-4">{athlete.grade}</td>
                    <td className="px-6 py-4 text-yellow-300">{athlete.personal_record}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
