import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import ListContent from '../components/ListContent'
import Footer from '../components/Footer'
import FloatingButton from '../components/FloatingButton';

export default function List() {
  return (
    <div className="bg-gray-900 text-white font-sans">
      <Navbar />
      <Sidebar />
      <ListContent />
      <Footer />
      <FloatingButton />
    </div>
  )
}
