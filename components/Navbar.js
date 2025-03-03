import Link from 'next/link'
import { usePagination } from "../context/PaginationContext";

export default function Navbar() {
  const { setCurrentPage } = usePagination();
  return (
    <header className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
        <Link href="/" onClick={() => setCurrentPage(1)} className="flex items-center">
    <img
      alt="Mangamas Logo"
      src="/images/logo.svg"
      className="w-[175px] sm:w-[275px] max-w-full h-auto"
    />
  </Link>
        </div>
        <nav className="hidden md:flex space-x-6 font-semibold">
          <Link href="/" onClick={() => setCurrentPage(1)} className="hover:text-gray-400">Beranda</Link>
          {/*<Link href="/project" className="hover:text-gray-400">Project</Link>*/}
          <Link href="/list" onClick={() => setCurrentPage(1)} className="hover:text-gray-400">Daftar Komik</Link>
          <Link href="#" className="hover:text-gray-400">Bookmark</Link>
          <Link href="#" className="hover:text-gray-400">Tentang</Link>
        </nav>
      </div>
    </header>
  )
}
