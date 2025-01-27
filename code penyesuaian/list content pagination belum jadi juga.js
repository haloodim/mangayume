import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BookOpenIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const generateSlug = (folderName) => {
  return folderName
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

export default function ListContent({ comics }) {
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const itemsPerPage = 15; // Maksimal konten per halaman

  // Hitung total halaman berdasarkan jumlah konten
  const totalPages = Math.ceil(comics.length / itemsPerPage);


  // Filter konten untuk halaman saat ini
const currentComics = comics.slice(
  (currentPage - 1) * itemsPerPage,  // Hitung indeks awal (misal: 0 untuk page 1, 15 untuk page 2, dst)
  currentPage * itemsPerPage         // Hitung indeks akhir (misal: 15 untuk page 1, 30 untuk page 2, dst)
);


  // Debug log untuk memastikan data yang tampil
  useEffect(() => {
    console.log('Comics Data:', comics);
    console.log('Current Page:', currentPage);
    console.log('Total Pages:', totalPages);
    console.log('Displaying Comics on Page:', currentComics);
  }, [comics, currentPage]);

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'Manga':
        return 'bg-red-500';
      case 'Manhwa':
        return 'bg-blue-500';
      case 'Manhua':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handlePageChange = (page) => {
    // Pastikan page berada dalam rentang yang valid
    if (page >= 1 && page <= totalPages) {
      console.log('Navigating to page:', page);
      setCurrentPage(page);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <div className="bg-gray-800 p-2 sm:p-6 md:p-6 rounded-lg shadow-lg mx-0 sm:mx-4 md:mx-20 lg:mx-40">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpenIcon className="h-5 w-5 text-white" />
          <ChevronRightIcon className="h-3 w-3 text-white" />
          <span className="text-white text-lg">Daftar Komik</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {currentComics.map((comic) => {
            const slug = generateSlug(comic.title);
            return (
              <div key={slug} className="flex flex-col items-center text-center">
                <Link href={`/komik/${slug}`} className="image-hover">
                  <img
                    alt={`Cover of ${comic.title}`}
                    className="rounded-lg w-full h-64 object-cover"
                    src={comic.image}
                    loading="lazy"
                  />
                  <div
                    className={`absolute top-0 left-0 text-white text-xs font-bold px-2 py-1 rounded-br-lg ${getBackgroundColor(comic.type)}`}
                  >
                    {comic.type}
                  </div>
                  <div className="absolute bottom-2 right-2 flex items-center">
                    <div
                      className={`bg-${comic.status === 'Ongoing' ? 'green' : 'red'}-500 rounded-full w-3 h-3 mr-1`}
                    ></div>
                    <span className="text-xs">{comic.status}</span>
                  </div>
                </Link>
                <Link
                  href={`/komik/${slug}`}
                  className="text-[15px] font-bold mt-4 title-hover"
                >
                  <div className="text-center w-full">
                    <span className="block">
                      {comic.title.length > 32
                        ? comic.title.slice(0, 32) + '...'
                        : comic.title}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="col-span-full flex justify-center mt-4">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-4 py-2 border border-gray-700 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white rounded-l-md ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 border-t border-b border-gray-700 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white ${
                  currentPage === index + 1 ? 'bg-gray-700 text-white' : ''
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-4 py-2 border border-gray-700 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white rounded-r-md ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </main>
  );
}
