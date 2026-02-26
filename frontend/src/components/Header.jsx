function Header() {
  return (
    <header className="w-full bg-gradient-to-br from-green-950 via-green-800 to-green-600 py-16 sm:py-24 px-6 flex flex-col items-center text-center">
      {/* Decorative badge — hidden from screen readers */}
      <div aria-hidden="true" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mb-6 sm:mb-8 shadow-xl">
        <span className="text-white text-2xl sm:text-3xl font-extrabold">JC</span>
      </div>
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 leading-tight">
        <span className="text-white">Jones County</span>
        <br />
        <span className="text-yellow-400">Cross Country</span>
      </h1>
      <p className="text-green-100 text-base sm:text-xl max-w-xl mt-3 font-light">
        Building endurance, character, and team pride — one mile at a time.
      </p>
    </header>
  )
}

export default Header
