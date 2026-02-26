function Header() {
  return (
    <div className="flex flex-col items-center mt-12 mb-10">
      <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center mb-6 shadow-lg">
        <span className="text-blue-800 text-2xl font-bold">JC</span>
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400 text-center mb-2">
        Jones County Cross Country
      </h1>
      <p className="text-blue-200 text-lg text-center max-w-md">
        Building endurance, character, and team pride — one mile at a time.
      </p>
    </div>
  )
}

export default Header
