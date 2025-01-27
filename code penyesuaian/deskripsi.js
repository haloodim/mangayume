import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import DeskripsiContent from '../components/DeskripsiContent'
import Footer from '../components/Footer'
import FloatingButton from '../components/FloatingButton';

export default function Deskripsi() {
    return (
      <div className="bg-gray-900 text-white font-sans">
        <Navbar />
        <Sidebar />
        <DeskripsiContent />
        <Footer />
        <FloatingButton />
      </div>
    )
  }