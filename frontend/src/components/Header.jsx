function Header() {
  return (
    <div className="w-full bg-gradient-to-br from-green-950 via-green-800 to-green-600 py-24 px-6 flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mb-8 shadow-xl">
        <span className="text-white text-3xl font-extrabold">JC</span>
      </div>
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 leading-none">
        <span className="text-white">Jones County</span>
        <br />
        <span className="text-yellow-400">Cross Country</span>
      </h1>
      <p className="text-green-100 text-xl sm:text-2xl max-w-xl mt-4 font-light">
        Building endurance, character, and team pride — one mile at a time.
      </p>
    </div>
  )
}

export default Header
