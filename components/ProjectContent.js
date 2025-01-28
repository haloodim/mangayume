import Link from 'next/link';
import { PencilIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const generateSlug = (folderName) => {
  return folderName
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

export default function ProjectContent({ comics }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth <= 768) {
        setItemsPerPage(12); // Untuk mobile, tampilkan 12 item per halaman
      } else {
        setItemsPerPage(15); // Untuk layar besar, tampilkan 15 item per halaman
      }
    };

    updateItemsPerPage(); // Atur item per halaman saat pertama kali load
    window.addEventListener('resize', updateItemsPerPage); // Update saat ukuran layar berubah

    return () => {
      window.removeEventListener('resize', updateItemsPerPage); // Bersihkan event listener saat unmount
    };
  }, []);

  const filteredComics = comics.filter((comic) => comic.project === 'Yes');
  const totalPages = Math.ceil(filteredComics.length / itemsPerPage);

  useEffect(() => {
    if (router.query.page) {
      setCurrentPage(Number(router.query.page));
    }
  }, [router.query.page]);

  const currentComics = filteredComics.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
  
      // Scroll ke atas dengan smooth
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
  
      // Update URL dengan query parameter ?page={page}
      router.push(`/project?page=${page}`, undefined, { shallow: true });
    }
  };


  return (
    <main className="container mx-auto p-4 min-h-screen">
      <div className="bg-gray-800 min-h-screen p-2 sm:p-6 md:p-6 rounded-lg shadow-lg mx-0 sm:mx-4 md:mx-20 lg:mx-40">
        <div className="flex items-center space-x-2 mb-4">
          <PencilIcon className="h-5 w-5 text-white" />
          <ChevronRightIcon className="h-3 w-3 text-white" />
          <span className="text-white text-lg">Project</span>
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

      </div>

          {/* Pagination */}
        <div className="col-span-full flex justify-center mt-4">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-4 py-2 border border-gray-700 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white rounded-l-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 border-t border-b border-gray-700 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white ${currentPage === index + 1 ? 'bg-gray-700 text-white' : ''}`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-4 py-2 border border-gray-700 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white rounded-r-md ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </nav>
        </div>

    </main>
  );
}
