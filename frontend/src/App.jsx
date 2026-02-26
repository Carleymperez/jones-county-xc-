import { useQuery } from '@tanstack/react-query'
import Header from './components/Header'
import AthletesTable from './components/AthletesTable'
import WelcomeBanner from './components/WelcomeBanner'
import TodayDate from './components/TodayDate'

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
      <AthletesTable athletes={athletes} isLoading={isLoading} error={error} />
    </div>
  )
}

export default App
