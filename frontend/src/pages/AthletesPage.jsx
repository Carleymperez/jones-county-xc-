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
    <div className="w-full max-w-5xl px-4 py-8">
      <h2 className="text-2xl font-bold tracking-tight text-green-700 mb-4">Athletes</h2>
      {isLoading && <p className="text-gray-500">Loading athletes...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {athletes.map(a => (
          <AthleteCard key={a.id} name={a.name} grade={a.grade} time={a.personal_record} />
        ))}
      </div>
    </div>
  )
}

export default AthletesPage
