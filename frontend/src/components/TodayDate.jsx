function TodayDate() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <p className="text-gray-600 text-sm mb-8">{today}</p>
  )
}

export default TodayDate
