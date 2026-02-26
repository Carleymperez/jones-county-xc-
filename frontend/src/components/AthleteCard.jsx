function StopwatchIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="13" r="8" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="9" y1="2" x2="15" y2="2" />
      <line x1="12" y1="2" x2="12" y2="5" />
    </svg>
  )
}

function AthleteCard({ name, grade, time }) {
  return (
    <article className="bg-white border-2 border-gray-200 rounded-xl px-6 py-5 shadow-sm
                    hover:shadow-xl hover:border-green-500 hover:scale-[1.04] hover:-translate-y-1
                    active:scale-[0.99] transition-all duration-200">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">
        Grade {grade}
      </p>
      <p className="text-xl font-bold text-gray-900 mb-3">{name}</p>
      <div className="flex items-center gap-2 mb-4 text-green-600">
        <StopwatchIcon />
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">5K PR</span>
        <span className="text-lg font-semibold">{time}</span>
      </div>
      <button
        aria-label={`View details for ${name}`}
        className="w-full bg-green-600 text-white hover:bg-green-700 text-sm font-medium py-2 rounded-lg transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
      >
        View Details
      </button>
    </article>
  )
}

export default AthleteCard
