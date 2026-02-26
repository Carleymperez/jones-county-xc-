import Header from '../components/Header'
import TodayDate from '../components/TodayDate'
import WelcomeBanner from '../components/WelcomeBanner'

function HomePage() {
  return (
    <div className="flex flex-col items-center w-full">
      <WelcomeBanner />
      <Header />
      <TodayDate />
    </div>
  )
}

export default HomePage
