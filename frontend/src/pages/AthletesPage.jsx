import { useQuery } from '@tanstack/react-query'
import AthleteCard from '../components/AthleteCard'

async function fetchAthletes() {
  const res = await fetch('/api/athletes')
  if (!res.ok) throw new Error('Failed to fetch athletes')
  return res.json()
}

// Mirrors the exact shape of AthleteCard
function AthleteCardSkeleton() {
  return (
    <div aria-hidden="true" className="bg-white border-2 border-gray-200 rounded-xl px-6 py-5 animate-pulse">
      {/* Grade label */}
      <div className="h-3 bg-gray-200 rounded w-1/4 mb-3" />
      {/* Name */}
      <div className="h-6 bg-gray-200 rounded w-2/3 mb-4" />
      {/* PR row: stopwatch icon + "5K PR" label + time */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0" />
        <div className="h-3 bg-gray-100 rounded w-10" />
        <div className="h-4 bg-gray-200 rounded w-14" />
      </div>
      {/* View Details button */}
      <div className="h-9 bg-gray-200 rounded-lg w-full" />
    </div>
  )
}

function AthletesPage() {
  const { data: athletes = [], isPending, isError, error, refetch } = useQuery({
    queryKey: ['athletes'],
    queryFn: fetchAthletes,
  })

  return (
    <div className="w-full max-w-5xl px-4 py-8">
      <h2 className="text-2xl font-bold tracking-tight text-green-700 mb-6">Athletes</h2>

      {isPending && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <AthleteCardSkeleton key={i} />)}
        </div>
      )}

      {isError && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold text-red-700">Failed to load athletes</p>
            <p className="text-red-600 text-sm mt-1">{error.message}</p>
          </div>
          <button
            onClick={() => refetch()}
            className="shrink-0 bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg
                       hover:bg-red-700 transition-colors
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      {!isPending && !isError && athletes.length === 0 && (
        <p role="status" className="text-gray-500">No athletes found.</p>
      )}

      {!isPending && !isError && athletes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
          {athletes.map(a => (
            <AthleteCard key={a.id} name={a.name} grade={a.grade} time={a.personal_record} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AthletesPage
