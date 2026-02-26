const PLACEHOLDER_MEETS = [
  { id: 1, name: 'Jaguar Invitational',       date: 'September 6, 2025',  location: 'Laurel Hill Park, Laurel, MS' },
  { id: 2, name: 'Pine Belt Classic',          date: 'September 20, 2025', location: 'Lake Thoreau, Hattiesburg, MS' },
  { id: 3, name: 'Jones County Invitational',  date: 'October 4, 2025',    location: 'Jones County Junior College' },
  { id: 4, name: 'MHSAA 5A South State',       date: 'October 25, 2025',   location: 'Biloxi, MS' },
]

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function UpcomingMeets() {
  return (
    <div className="w-full max-w-2xl px-4 pb-12">
      <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Upcoming Meets</h2>
      <div className="flex flex-col gap-3">
        {PLACEHOLDER_MEETS.map(meet => (
          <div
            key={meet.id}
            className="bg-blue-900 rounded-lg px-6 py-4 shadow cursor-pointer
                       hover:bg-blue-800 hover:shadow-lg hover:scale-[1.01]
                       active:scale-[0.99] transition-all duration-150
                       flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-semibold text-white truncate">{meet.name}</p>
              <p className="text-blue-300 text-sm truncate">{meet.location}</p>
            </div>
            <div className="flex items-center gap-1.5 text-yellow-400 text-sm font-medium shrink-0">
              <CalendarIcon />
              {meet.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingMeets
