import { useState } from 'react'
import RaceCategorySelect from '../components/RaceCategorySelect'
import ResultsTable from '../components/ResultsTable'

function ResultsPage() {
  const [raceCategory, setRaceCategory] = useState('')

  return (
    <div className="w-full max-w-2xl px-4 py-8">
      <div className="mb-6">
        <RaceCategorySelect value={raceCategory} onChange={setRaceCategory} />
      </div>
      <ResultsTable />
    </div>
  )
}

export default ResultsPage
