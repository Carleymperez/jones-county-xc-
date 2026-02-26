import { Button } from '@/components/ui/button'

function AthleteCard({ name, grade, time }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-6 py-5 shadow-sm
                    hover:shadow-md hover:border-gray-300 hover:scale-[1.02]
                    active:scale-[0.99] transition-all duration-150 cursor-pointer">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
        Grade {grade}
      </p>
      <p className="text-xl font-bold text-gray-900 mb-3">{name}</p>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">5K PR</span>
        <span className="text-lg font-semibold text-green-600">{time}</span>
      </div>
      <Button variant="outline" size="sm" className="w-full">View Details</Button>
    </div>
  )
}

export default AthleteCard
