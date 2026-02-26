import { useQuery } from '@tanstack/react-query'

async function fetchMeets() {
  const res = await fetch('/api/meets')
  if (!res.ok) throw new Error('Failed to fetch meets')
  return res.json()
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

// Mirrors the exact shape of a meet card
function MeetCardSkeleton() {
  return (
    <div aria-hidden="true"
      className="bg-white border border-gray-200 border-l-4 border-l-green-200 rounded-xl px-6 py-4 shadow-sm animate-pulse
                 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-col gap-2 min-w-0">
        {/* Meet name */}
        <div className="h-4 bg-gray-200 rounded w-44" />
        {/* Location */}
        <div className="h-3 bg-gray-100 rounded w-32" />
      </div>
      {/* Calendar icon + date */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-4 h-4 bg-gray-200 rounded shrink-0" />
        <div className="h-3 bg-gray-200 rounded w-28" />
      </div>
    </div>
  )
}

function UpcomingMeets() {
  const { data: meets = [], isPending, isError, error, refetch } = useQuery({
    queryKey: ['meets'],
    queryFn: fetchMeets,
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const upcomingMeets = meets
    .filter(meet => new Date(meet.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <section aria-labelledby="upcoming-meets-heading" className="w-full max-w-2xl px-4 pb-12">
      <h2 id="upcoming-meets-heading" className="text-2xl font-bold tracking-tight text-green-700 mb-4">Upcoming Meets</h2>

      {isPending && (
        <ul className="flex flex-col gap-3 list-none">
          {Array.from({ length: 3 }).map((_, i) => <li key={i}><MeetCardSkeleton /></li>)}
        </ul>
      )}

      {isError && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold text-red-700">Failed to load meets</p>
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

      {!isPending && !isError && upcomingMeets.length === 0 && (
        <p role="status" className="text-gray-500">No upcoming meets scheduled.</p>
      )}

      {!isPending && !isError && upcomingMeets.length > 0 && (
        <ul className="flex flex-col gap-3 list-none animate-in fade-in duration-300">
          {upcomingMeets.map(meet => (
            <li key={meet.id}>
              <article
                aria-label={`${meet.name}, ${meet.date}, ${meet.location}`}
                className="bg-white border border-gray-200 border-l-4 border-l-green-500 rounded-xl px-6 py-4 shadow-sm
                           hover:shadow-md transition-shadow duration-150
                           flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{meet.name}</h3>
                  <p className="text-gray-600 text-sm truncate">{meet.location}</p>
                </div>
                <div className="flex items-center gap-1.5 text-green-700 text-sm font-medium shrink-0">
                  <CalendarIcon />
                  <span>{meet.date}</span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default UpcomingMeets
