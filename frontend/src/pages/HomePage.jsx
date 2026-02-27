import Header from '../components/Header'
import WelcomeBanner from '../components/WelcomeBanner'
import UpcomingMeets from '../components/UpcomingMeets'
import teamPhoto from '../assets/team-photo.png'

function HomePage() {
  return (
    <div className="flex flex-col items-center w-full">
      <WelcomeBanner />
      <div className="w-full bg-gradient-to-br from-green-950 via-green-800 to-green-600 flex flex-col items-center">
        <Header />
        <section aria-label="Team photo" className="w-full max-w-4xl px-4 pb-12">
          <img
            src={teamPhoto}
            alt="Jones County Cross Country team posing with trophies"
            className="w-full rounded-2xl shadow-2xl object-cover"
          />
        </section>
      </div>
      <div className="w-full flex flex-col items-center py-8">
        <UpcomingMeets />
      </div>
    </div>
  )
}

export default HomePage
