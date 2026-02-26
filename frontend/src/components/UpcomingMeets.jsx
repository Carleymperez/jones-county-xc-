const PLACEHOLDER_MEETS = [
  { id: 1, name: 'Jaguar Invitational',    date: 'September 6, 2025',  location: 'Laurel Hill Park, Laurel, MS' },
  { id: 2, name: 'Pine Belt Classic',      date: 'September 20, 2025', location: 'Lake Thoreau, Hattiesburg, MS' },
  { id: 3, name: 'Jones County Invitational', date: 'October 4, 2025', location: 'Jones County Junior College' },
  { id: 4, name: 'MHSAA 5A South State',   date: 'October 25, 2025',  location: 'Biloxi, MS' },
]

function UpcomingMeets() {
  return (
    <div className="w-full max-w-2xl px-4 pb-12">
      <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Upcoming Meets</h2>
      <div className="flex flex-col gap-3">
        {PLACEHOLDER_MEETS.map(meet => (
          <div key={meet.id} className="bg-blue-900 rounded-lg px-6 py-4 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <p className="font-semibold text-white">{meet.name}</p>
              <p className="text-blue-300 text-sm">{meet.location}</p>
            </div>
            <span className="text-yellow-400 text-sm font-medium whitespace-nowrap">{meet.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingMeets
