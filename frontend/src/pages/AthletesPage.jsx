import { useQuery } from '@tanstack/react-query'
import AthleteCard from '../components/AthleteCard'

async function fetchAthletes() {
  const res = await fetch('/api/athletes')
  if (!res.ok) throw new Error('Failed to fetch athletes')
  return res.json()
}

function AthletesPage() {
  const { data: athletes = [], isLoading, error } = useQuery({
    queryKey: ['athletes'],
    queryFn: fetchAthletes,
  })

  return (
    <div className="w-full max-w-2xl px-4 py-8 text-white">
      <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Athletes</h2>
      {isLoading && <p className="text-blue-200">Loading athletes...</p>}
      {error && <p className="text-red-300">Error: {error.message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {athletes.map(a => (
          <AthleteCard key={a.id} name={a.name} grade={a.grade} time={a.personal_record} />
        ))}
      </div>
    </div>
  )
}

export default AthletesPage
