import Link from 'next/link';
import { useState, useEffect } from 'react';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import { usePagination } from '../context/PaginationContext';

const generateSlug = (folderName) => {
  return folderName
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

const RelativeTimeDisplay = ({ time }) => {
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    const calculateRelativeTime = () => {
      const now = new Date();
      const timeDate = new Date(time);
      const localTimeDate = new Date(timeDate.getTime() + timeDate.getTimezoneOffset() * 60000);

      if (isNaN(localTimeDate.getTime())) {
        setFormattedTime("Waktu tidak valid");
        return;
      }

      const diffInSeconds = Math.floor((now - localTimeDate) / 1000);
      if (diffInSeconds < 0) {
        setFormattedTime("Waktu tidak valid");
        return;
      }

      const days = Math.floor(diffInSeconds / (60 * 60 * 24));
      const hours = Math.floor((diffInSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
      const seconds = diffInSeconds % 60;

      if (days >= 365) {
        setFormattedTime(`${Math.floor(days / 365)} tahun lalu`);
      } else if (days >= 30) {
        setFormattedTime(`${Math.floor(days / 30)} bulan lalu`);
      } else if (days >= 7) {
        setFormattedTime(`${Math.floor(days / 7)} minggu lalu`);
      } else if (days >= 1) {
        setFormattedTime(`${days} hari lalu`);
      } else if (hours >= 1) {
        setFormattedTime(`${hours} jam lalu`);
      } else if (minutes >= 1) {
        setFormattedTime(`${minutes} menit lalu`);
      } else {
        setFormattedTime(`${seconds} detik lalu`);
      }
    };

    calculateRelativeTime();
    const intervalId = setInterval(calculateRelativeTime, 1000);
    return () => clearInterval(intervalId);
  }, [time]);

  return <span>{formattedTime}</span>;
};

export default function HomeContent({ comics }) {
  const router = useRouter();
  const { currentPage, setCurrentPage } = usePagination();
  const [itemsPerPage, setItemsPerPage] = useState(15);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth <= 640) {
        setItemsPerPage(12);
      } else {
        setItemsPerPage(15);
      }
    };
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(comics.length / itemsPerPage);

  useEffect(() => {
    if (router.query.page) {
      setCurrentPage(Number(router.query.page));
    }
  }, [router.query.page]);

  const currentComics = comics.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'Manga': return 'bg-red-500';
      case 'Manhwa': return 'bg-blue-500';
      case 'Manhua': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      router.push(`?page=${page}`, undefined, { shallow: true });
    }
  };


  //blur image contetn
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
      const timer = setTimeout(() => setIsLoaded(true), 500); // Simulasi loading
      return () => clearTimeout(timer);
  }, []);

  return (
    <main className="container mx-auto p-4 min-h-screen">
      <div className="bg-gray-800 min-h-screen p-2 sm:p-6 md:p-6 rounded-lg shadow-lg mx-0 sm:mx-4 md:mx-20 lg:mx-40">
        <div className="flex items-center space-x-2 mb-4">
          <HomeIcon className="h-5 w-5 text-white" />
          <ChevronRightIcon className="h-3 w-3 text-white" />
          <span className="text-white text-lg">Chapter Update</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {currentComics.map((comic) => {
            const slug = generateSlug(comic.title);
            return (
              <div key={slug} className="flex flex-col items-center text-center">
                <Link href={`/komik/${slug}`} className="image-hover">
                  <img
                    alt={`Cover of ${comic.title}`}
                    className={`rounded-lg w-full h-64 object-cover transition-all duration-700 
                    ${isLoaded ? 'blur-none opacity-100' : 'blur-md opacity-50'}`}
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
                  className="text-[16px] font-bold mt-4 title-hover"
                >
                  <div className="text-center w-full">
                    <span className="block">
                      {comic.title.length > 32
                        ? comic.title.slice(0, 32) + '...'
                        : comic.title}
                    </span>
                  </div>
                </Link>
                {comic.chapters && comic.chapters.length > 0 ? (
                  comic.chapters.map((chapter, index) => (
                    <Link
                      key={index}
                      href={`/komik/${comic.slug}/${chapter.name}`}
                      className="mt-2 border border-white text-white py-1 px-2 rounded-full text-[13px] w-full flex justify-between hover:border-yellow-500 hover:text-yellow-500"
                    >
                      <span>Ch. {chapter.number}</span>
                      {/* Pastikan `createdAt` adalah string yang valid */}
                      <RelativeTimeDisplay time={chapter.createdAt} />
                    </Link>
                  ))
                ) : (
                  <p>No chapters available.</p>
                )}
              </div>
            );
          })}
        </div>

      </div>

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
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 border border-gray-700 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white ${currentPage === index + 1 ? 'bg-gray-700 text-white' : ''}`}
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
