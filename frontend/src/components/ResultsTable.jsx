import { useQuery } from '@tanstack/react-query'

async function fetchResults()  { const r = await fetch('/api/results');  if (!r.ok) throw new Error('Failed to fetch results');  return r.json() }
async function fetchAthletes() { const r = await fetch('/api/athletes'); if (!r.ok) throw new Error('Failed to fetch athletes'); return r.json() }
async function fetchMeets()    { const r = await fetch('/api/meets');    if (!r.ok) throw new Error('Failed to fetch meets');    return r.json() }

function ResultsTable() {
  const { data: results  = [] } = useQuery({ queryKey: ['results'],  queryFn: fetchResults  })
  const { data: athletes = [] } = useQuery({ queryKey: ['athletes'], queryFn: fetchAthletes })
  const { data: meets    = [] } = useQuery({ queryKey: ['meets'],    queryFn: fetchMeets    })

  const athleteMap = Object.fromEntries(athletes.map(a => [a.id, a.name]))
  const meetMap    = Object.fromEntries(meets.map(m => [m.id, m.name]))

  const isLoading = !results.length && !athletes.length && !meets.length
  const rows = [...results].sort((a, b) => (a.place ?? 99) - (b.place ?? 99))

  return (
    <div className="w-full max-w-2xl px-4 pb-12">
      <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Results</h2>

      {isLoading && <p className="text-blue-200">Loading results...</p>}

      {!isLoading && rows.length === 0 && (
        <p className="text-blue-300">No results recorded yet.</p>
      )}

      {rows.length > 0 && (
        <div className="bg-blue-900 rounded-lg overflow-hidden shadow-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-blue-950 text-yellow-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-3">Place</th>
                <th className="px-6 py-3">Athlete</th>
                <th className="px-6 py-3">Meet</th>
                <th className="px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(result => (
                <tr key={result.id} className="border-t border-blue-800 hover:bg-blue-800 transition-colors">
                  <td className="px-6 py-4 font-semibold text-yellow-300">
                    {result.place ?? '—'}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {athleteMap[result.athleteId] ?? `Athlete #${result.athleteId}`}
                  </td>
                  <td className="px-6 py-4 text-blue-300">
                    {meetMap[result.meetId] ?? `Meet #${result.meetId}`}
                  </td>
                  <td className="px-6 py-4 text-yellow-300">
                    {result.time ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ResultsTable
