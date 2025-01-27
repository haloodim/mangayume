import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import ProjectContent from '../components/ProjectContent'
import Footer from '../components/Footer'
import FloatingButton from '../components/FloatingButton';

export default function Project() {
  return (
    <div className="bg-gray-900 text-white font-sans">
      <Navbar />
      <Sidebar />
      <ProjectContent />
      <Footer />
      <FloatingButton />
    </div>
  )
}
