import { useQuery } from '@tanstack/react-query'
import Header from './components/Header'
import AthleteCard from './components/AthleteCard'
import WelcomeBanner from './components/WelcomeBanner'
import TodayDate from './components/TodayDate'
import UpcomingMeets from './components/UpcomingMeets'
import ResultsTable from './components/ResultsTable'

async function fetchAthletes() {
  const res = await fetch('/api/athletes')
  if (!res.ok) throw new Error('Failed to fetch athletes')
  return res.json()
}

function App() {
  const { data: athletes = [], isLoading, error } = useQuery({
    queryKey: ['athletes'],
    queryFn: fetchAthletes,
  })

  return (
    <div className="min-h-screen bg-blue-800 flex flex-col items-center text-white">
      <WelcomeBanner />
      <Header />
      <TodayDate />
      <UpcomingMeets />
      <div className="w-full max-w-2xl px-4 pb-12">
        <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Athletes</h2>
        {isLoading && <p className="text-blue-200">Loading athletes...</p>}
        {error && <p className="text-red-300">Error: {error.message}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {athletes.map(a => (
            <AthleteCard key={a.id} name={a.name} grade={a.grade} time={a.personal_record} />
          ))}
        </div>
      </div>
      <ResultsTable />
    </div>
  )
}

export default App
