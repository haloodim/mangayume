import Link from 'next/link';
import { PencilIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

// Fungsi untuk membuat slug dari nama folder
const generateSlug = (folderName) => {
  return folderName
    .toLowerCase()
    .replace(/ /g, '-') // Ganti spasi dengan "-"
    .replace(/[^\w-]+/g, ''); // Hapus karakter non-alfanumerik
};

export default function ProjectContent({ comics }) {
  const filteredComics = comics.filter((comic) => comic.project === 'Yes'); // Filter berdasarkan project "Yes"

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'Manga':
        return 'bg-red-500';
      case 'Manhwa':
        return 'bg-blue-500';
      case 'Manhua':
        return 'bg-green-500';
      default:
        return 'bg-gray-500'; // Default color
    }
  };

  return (
    <main className="container mx-auto p-4">
      <div className="bg-gray-800 p-2 sm:p-6 md:p-6 rounded-lg shadow-lg mx-0 sm:mx-4 md:mx-20 lg:mx-40">
        <div className="flex items-center space-x-2 mb-4">
          <PencilIcon className="h-5 w-5 text-white" />
          <ChevronRightIcon className="h-3 w-3 text-white" />
          <span className="text-white text-lg">Project</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredComics.map((comic) => {
            const slug = generateSlug(comic.title); // Hasilkan slug dari title komik
            return (
              <div key={slug} className="flex flex-col items-center text-center">
                <Link href={`/komik/${slug}`} className="image-hover">
                  <img
                    alt={`Cover of ${comic.title}`}
                    className="rounded-lg w-full h-64 object-cover" // Ukuran gambar seragam
                    src={comic.image}
                    loading="lazy"
                  />
                  <div
                    className={`absolute top-0 left-0 text-white text-xs font-bold px-2 py-1 rounded-br-lg ${getBackgroundColor(comic.type)}`}
                  >
                    {comic.type}
                  </div>
                  <div className="absolute bottom-2 right-2 flex items-center">
                    <div className={`bg-${comic.status === 'Ongoing' ? 'green' : 'red'}-500 rounded-full w-3 h-3 mr-1`}></div>
                    <span className="text-xs">{comic.status}</span>
                  </div>
                </Link>
                <Link href={`/komik/${slug}`} className="text-[15px] font-bold mt-4 title-hover">
                  <div className="text-center w-full">
                    <span className="block">
                      {comic.title.length > 32 ? comic.title.slice(0, 32) + '...' : comic.title}
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
            <Link
              href="/komik?page=1"
              className="px-4 py-2 border border-gray-700 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white rounded-l-md"
            >
              Previous
            </Link>
            <Link
              href="/komik?page=1"
              className="px-4 py-2 border-t border-b border-gray-700 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white"
            >
              1
            </Link>
            <Link
              href="/komik?page=2"
              className="px-4 py-2 border-t border-b border-gray-700 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white"
            >
              2
            </Link>
            <Link
              href="/komik?page=3"
              className="px-4 py-2 border-t border-b border-gray-700 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white"
            >
              3
            </Link>
            <Link
              href="/komik?page=2"
              className="px-4 py-2 border border-gray-700 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white rounded-r-md"
            >
              Next
            </Link>
          </nav>
        </div>
      </div>
    </main>
  );
}
