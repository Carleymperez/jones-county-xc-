function Header() {
  return (
    <div className="flex flex-col items-center mt-12 mb-10">
      <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center mb-6 shadow-lg">
        <span className="text-white text-2xl font-bold">JC</span>
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center mb-2">
        <span className="text-green-600">Jones County</span>{' '}
        <span className="text-yellow-500">Cross Country</span>
      </h1>
      <p className="text-gray-500 text-lg text-center max-w-md">
        Building endurance, character, and team pride — one mile at a time.
      </p>
    </div>
  )
}

export default Header
