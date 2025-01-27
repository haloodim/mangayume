import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import HomeContent from '../components/HomeContent'
import Footer from '../components/Footer'
import FloatingButton from '../components/FloatingButton';

export default function Home() {
  return (
    <div className="bg-gray-900 text-white font-sans">
      <Navbar />
      <Sidebar />
      <HomeContent />
      <Footer />
      <FloatingButton />
    </div>
  )
}
