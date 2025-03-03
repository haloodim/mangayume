import Link from 'next/link';
import { useState } from 'react';
import { usePagination } from "../context/PaginationContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const openNav = () => {
    setIsOpen(true);
  };

  const closeNav = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu untuk layar kecil */}
      <div className="md:hidden">
        {/* Hamburger Button (Tampil hanya jika Sidebar belum terbuka) */}
        <div
          className={`absolute top-4 right-4 z-50 ${isOpen ? 'hidden' : ''}`}
        >
          <button
            className="p-3 rounded-md bg-gray-800 text-white hover:bg-gray-700"
            onClick={openNav}
          >
            ☰
          </button>
        </div>

        {/* Sidebar */}
        <div
          id="mySidenav"
          className={`font-semibold fixed top-0 right-0 h-full bg-gray-900 text-white transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{
            width: '250px',
            zIndex: 1000, // Pastikan z-index tinggi agar elemen berada di atas
            position: 'fixed', // Pastikan ini fixed
            top: 0, // Pastikan diatur di posisi atas
            right: 0, // Posisi di kanan
            height: '100vh', // Pastikan tinggi 100% viewport height
          }}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 left-4 text-white text-2xl"
            onClick={closeNav}
          >
            &times;
          </button>

          {/* Sidebar Content */}
          <div className="flex items-center p-4 mt-8">
            {/* Bisa ditambahkan logo atau nama jika perlu */}
          </div>
          <Link href="/" onClick={() => setCurrentPage(1)} className="block py-2 px-4 hover:text-gray-400">
            Beranda
          </Link>
          {/*<Link href="/project" className="block py-2 px-4 hover:text-gray-400">
            Project
          </Link>*/}
          <Link href="/list" onClick={() => setCurrentPage(1)} className="block py-2 px-4 hover:text-gray-400">
            Daftar Komik
          </Link>
          <Link href="#" className="block py-2 px-4 hover:text-gray-400">
            Bookmark
          </Link>
          <Link href="#" className="block py-2 px-4 hover:text-gray-400">
            Tentang
          </Link>
        </div>
      </div>
    </>
  );
}
