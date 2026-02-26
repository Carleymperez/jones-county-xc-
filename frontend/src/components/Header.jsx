import TodayDate from './TodayDate'
import jcLogo from '../assets/jc-logo.png'

function Header() {
  return (
    <header className="w-full py-16 sm:py-24 px-6 flex flex-col items-center text-center">
      <img
        src={jcLogo}
        alt="Jones County Greyhounds logo"
        className="w-28 h-28 sm:w-36 sm:h-36 object-contain mb-6 sm:mb-8 drop-shadow-xl"
      />
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 leading-tight">
        <span className="text-white">Jones County</span>
        <br />
        <span className="text-yellow-400">Cross Country</span>
      </h1>
      <p className="text-green-100 text-base sm:text-xl max-w-xl mt-3 font-light">
        Building endurance, character, and team pride — one mile at a time.
      </p>
      <TodayDate />
    </header>
  )
}

export default Header
