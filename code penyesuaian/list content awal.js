import Link from 'next/link';
import { BookOpenIcon, ChevronRightIcon } from '@heroicons/react/24/solid';;

export default function ListContent() {
  return (
    <main className="container mx-auto p-4">
      <div className="bg-gray-800 p-2 sm:p-6 md:p-6 rounded-lg shadow-lg mx-0 sm:mx-4 md:mx-20 lg:mx-40 ">
        
        <div className="flex items-center space-x-2 mb-4">
          <BookOpenIcon className="h-5 w-5 text-white" />
          <ChevronRightIcon className="h-3 w-3 text-white" />
          <span className="text-white text-lg italic">Daftar Komik</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Add comic items here as in your original HTML */}
          <div className="flex flex-col items-center text-center">
            <Link href="/deskripsi" className="image-hover">
              <img
                alt="Cover of I Took Over The System Players Manga"
                className="rounded-lg w-full object-cover"
                src="https://cdn.manhwature.com/resize/240/346/apkomik.cc/wp-content/uploads/2024/12/1dd3a9a3dfa94d21a4cc3a4f031cf349tplv-scl3phc04j-image.jpeg"
                loading="lazy"
              />
              <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg">Manga</div>
              <div className="absolute bottom-2 right-2 flex items-center">
                <div className="bg-green-500 rounded-full w-3 h-3 mr-1"></div>
                <span className="text-xs">Ongoing</span>
              </div>
            </Link>
            <Link href="/deskripsi" className="text-[17px] font-bold mt-4 title-hover">
              I Took Over The System Players
            </Link>
            <Link
            href="#"
                    className="mt-2 border border-white text-white py-1 px-2 rounded-full text-[13px] w-full flex justify-center hover:border-blue-500 hover:text-blue-500">All Chapter
            </Link>
          </div>

          {/* Repeat this pattern for other sections if needed */}

          <div className="col-span-full flex justify-center mt-4">
            <nav className="inline-flex rounded-md shadow">
              <Link
                href="/deskripsi"
                className="px-4 py-2 border border-gray-700 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white rounded-l-md"
              >
                Previous
              </Link>
              <Link
                href="/deskripsi"
                className="px-4 py-2 border-t border-b border-gray-700 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white"
              >
                1
              </Link>
              <Link
                href="/deskripsi"
                className="px-4 py-2 border-t border-b border-gray-700 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white"
              >
                2
              </Link>
              <Link
                href="/deskripsi"
                className="px-4 py-2 border-t border-b border-gray-700 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white"
              >
                3
              </Link>
              <Link
                href="/deskripsi"
                className="px-4 py-2 border border-gray-700 text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white rounded-r-md"
              >
                Next
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </main>
  );
}
