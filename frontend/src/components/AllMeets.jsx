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

function CheckIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// Mirrors the exact shape of a meet card row
function MeetCardSkeleton({ accent = 'border-l-green-200' }) {
  return (
    <div aria-hidden="true"
      className={`bg-white border border-gray-200 border-l-4 ${accent} rounded-xl px-6 py-4 shadow-sm animate-pulse
                  flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}
    >
      <div className="flex flex-col gap-2 min-w-0">
        <div className="h-4 bg-gray-200 rounded w-44" />
        <div className="h-3 bg-gray-100 rounded w-32" />
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-4 h-4 bg-gray-200 rounded shrink-0" />
        <div className="h-3 bg-gray-200 rounded w-28" />
      </div>
    </div>
  )
}

// Mirrors the section label + a few cards per group
function MeetsSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-8">
      {/* Upcoming section */}
      <div>
        <div className="h-3 bg-green-100 rounded w-20 mb-3" />
        <ul className="flex flex-col gap-3 list-none">
          {Array.from({ length: 3 }).map((_, i) => <li key={i}><MeetCardSkeleton accent="border-l-green-200" /></li>)}
        </ul>
      </div>
      {/* Past section */}
      <div>
        <div className="h-3 bg-gray-200 rounded w-10 mb-3" />
        <ul className="flex flex-col gap-3 list-none">
          {Array.from({ length: 2 }).map((_, i) => <li key={i}><MeetCardSkeleton accent="border-l-gray-200" /></li>)}
        </ul>
      </div>
    </div>
  )
}

function MeetCard({ meet, status }) {
  const styles = {
    today: {
      card: 'bg-yellow-50 border-yellow-300 border-l-4 border-l-yellow-400 hover:shadow-md transition-shadow duration-150',
      title: 'text-gray-900',
      date: 'text-yellow-700',
      badge: <span className="ml-1 text-xs bg-yellow-400 text-yellow-900 font-semibold px-2 py-0.5 rounded-full">Today</span>,
    },
    upcoming: {
      card: 'bg-white border-gray-200 border-l-4 border-l-green-500 hover:shadow-md transition-shadow duration-150',
      title: 'text-gray-900',
      date: 'text-green-700',
      badge: null,
    },
    past: {
      card: 'bg-gray-50 border-gray-200 border-l-4 border-l-gray-300',
      title: 'text-gray-500',
      date: 'text-gray-400',
      badge: <span className="ml-1 text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Completed</span>,
    },
  }

  const s = styles[status]

  return (
    <article
      aria-label={`${meet.name}, ${meet.date}, ${meet.location}${status === 'past' ? ', completed' : status === 'today' ? ', today' : ''}`}
      className={`border rounded-xl px-6 py-4 shadow-sm flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between ${s.card}`}
    >
      <div className="min-w-0">
        <h3 className={`font-semibold truncate ${s.title}`}>{meet.name}</h3>
        <p className="text-gray-500 text-sm truncate">{meet.location}</p>
      </div>
      <div className={`flex items-center gap-1.5 text-sm font-medium shrink-0 ${s.date}`}>
        {status === 'past' ? <CheckIcon /> : <CalendarIcon />}
        <span>{meet.date}</span>
        {s.badge}
      </div>
    </article>
  )
}

function SectionHeader({ label, color }) {
  return <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${color}`}>{label}</h3>
}

function AllMeets() {
  const { data: meets = [], isPending, isError, error, refetch } = useQuery({
    queryKey: ['meets'],
    queryFn: fetchMeets,
  })

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const todayMeets    = meets.filter(m => { const d = new Date(m.date); return d >= todayStart && d <= todayEnd })
  const upcomingMeets = meets.filter(m => new Date(m.date) > todayEnd).sort((a, b) => new Date(a.date) - new Date(b.date))
  const pastMeets     = meets.filter(m => new Date(m.date) < todayStart).sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <section aria-labelledby="all-meets-heading" className="w-full max-w-2xl px-4 pb-12">
      <h2 id="all-meets-heading" className="text-2xl font-bold tracking-tight text-green-700 mb-6">Meet Schedule</h2>

      {isPending && <MeetsSkeleton />}

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

      {!isPending && !isError && meets.length === 0 && (
        <p role="status" className="text-gray-500">No meets scheduled.</p>
      )}

      {!isPending && !isError && meets.length > 0 && (
        <div className="animate-in fade-in duration-300 flex flex-col gap-8">
          {todayMeets.length > 0 && (
            <div>
              <SectionHeader label="Today" color="text-yellow-600" />
              <ul className="flex flex-col gap-3 list-none">
                {todayMeets.map(meet => <li key={meet.id}><MeetCard meet={meet} status="today" /></li>)}
              </ul>
            </div>
          )}
          {upcomingMeets.length > 0 && (
            <div>
              <SectionHeader label="Upcoming" color="text-green-600" />
              <ul className="flex flex-col gap-3 list-none">
                {upcomingMeets.map(meet => <li key={meet.id}><MeetCard meet={meet} status="upcoming" /></li>)}
              </ul>
            </div>
          )}
          {pastMeets.length > 0 && (
            <div>
              <SectionHeader label="Past" color="text-gray-400" />
              <ul className="flex flex-col gap-3 list-none">
                {pastMeets.map(meet => <li key={meet.id}><MeetCard meet={meet} status="past" /></li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default AllMeets
