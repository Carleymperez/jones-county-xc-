import { useQuery } from '@tanstack/react-query'

async function fetchResults()  { const r = await fetch('/api/results');  if (!r.ok) throw new Error('Failed to fetch results');  return r.json() }
async function fetchAthletes() { const r = await fetch('/api/athletes'); if (!r.ok) throw new Error('Failed to fetch athletes'); return r.json() }
async function fetchMeets()    { const r = await fetch('/api/meets');    if (!r.ok) throw new Error('Failed to fetch meets');    return r.json() }

function TableSkeleton() {
  return (
    <div aria-hidden="true" className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex gap-6">
        {['w-12', 'w-32', 'w-40', 'w-20'].map((w, i) => (
          <div key={i} className={`h-3 bg-gray-200 rounded ${w}`} />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border-t border-gray-100 px-6 py-4 flex gap-6">
          {['w-8', 'w-28', 'w-36', 'w-16'].map((w, j) => (
            <div key={j} className={`h-4 bg-gray-100 rounded ${w}`} />
          ))}
        </div>
      ))}
    </div>
  )
}

function ResultsTable() {
  const { data: results  = [], isPending: rPending, isError: rError, error: rErr, refetch: rRefetch } = useQuery({ queryKey: ['results'],  queryFn: fetchResults  })
  const { data: athletes = [], isPending: aPending } = useQuery({ queryKey: ['athletes'], queryFn: fetchAthletes })
  const { data: meets    = [], isPending: mPending } = useQuery({ queryKey: ['meets'],    queryFn: fetchMeets    })

  const athleteMap = Object.fromEntries(athletes.map(a => [a.id, a.name]))
  const meetMap    = Object.fromEntries(meets.map(m => [m.id, m.name]))

  const isPending = rPending || aPending || mPending
  const rows = [...results].sort((a, b) => (a.place ?? 99) - (b.place ?? 99))

  return (
    <div className="w-full max-w-2xl px-4 pb-12">
      <h2 className="text-2xl font-bold tracking-tight text-green-700 mb-4">Results</h2>

      {isPending && <TableSkeleton />}

      {rError && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold text-red-700">Failed to load results</p>
            <p className="text-red-600 text-sm mt-1">{rErr.message}</p>
          </div>
          <button
            onClick={() => rRefetch()}
            className="shrink-0 bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg
                       hover:bg-red-700 transition-colors
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      {!isPending && !rError && rows.length === 0 && (
        <p role="status" aria-live="polite" className="text-gray-600">No results recorded yet.</p>
      )}

      {!isPending && !rError && rows.length > 0 && (
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
