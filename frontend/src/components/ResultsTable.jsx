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
      <h2 className="text-2xl font-bold tracking-tight text-green-700 mb-4">Results</h2>

      {isLoading && (
        <p role="status" aria-live="polite" className="text-gray-600">Loading results...</p>
      )}

      {!isLoading && rows.length === 0 && (
        <p role="status" aria-live="polite" className="text-gray-600">No results recorded yet.</p>
      )}

      {rows.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left min-w-[480px]">
            <caption className="sr-only">Race results sorted by place</caption>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-green-700 text-xs uppercase tracking-wider">
                <th scope="col" className="px-3 sm:px-6 py-3">Place</th>
                <th scope="col" className="px-3 sm:px-6 py-3">Athlete</th>
                <th scope="col" className="px-3 sm:px-6 py-3">Meet</th>
                <th scope="col" className="px-3 sm:px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(result => (
                <tr key={result.id} className="border-t border-gray-100 hover:bg-green-50 transition-colors">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-green-600">
                    {result.place ?? '—'}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">
                    {athleteMap[result.athleteId] ?? `Athlete #${result.athleteId}`}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600">
                    {meetMap[result.meetId] ?? `Meet #${result.meetId}`}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-green-600">
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
