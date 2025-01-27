import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import FloatingButton from '../../components/FloatingButton';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link'; // Import Next.js Link
import { BookmarkIcon } from '@heroicons/react/24/outline'; // Mengimpor ikon bookmark
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';


// Fungsi untuk mengambil data statis dari file MDX
export async function getStaticProps({ params }) {
  const { slug } = params;
  const comicDir = path.join(process.cwd(), 'content', slug);

  try {
    if (!fs.existsSync(comicDir)) {
      throw new Error('Folder komik tidak ditemukan');
    }

    const files = fs.readdirSync(comicDir);
    const chapters = files
      .filter((file) => file.startsWith('chapter-') && file.endsWith('.mdx')) // Filter file chapter
      .map((file) => ({
        href: `/komik/${slug}/${file.replace('.mdx', '')}`, // Buat link dinamis
        name: file.replace('.mdx', '').replace('-', ' '), // Format nama chapter
        number: parseInt(file.match(/chapter-(\d+)/)?.[1], 10) || 0, // Ambil nomor chapter
      }))
      .sort((a, b) => b.number - a.number); // Urutkan berdasarkan nomor chapter (terbaru di atas)

    // Tandai chapter terbaru
    if (chapters.length > 0) {
      chapters[0].isNew = true; // Tandai chapter terbaru dengan properti isNew
    }

    // Baca file index.mdx
    const filePath = path.join(comicDir, 'index.mdx');
    if (!fs.existsSync(filePath)) {
      throw new Error('File index.mdx tidak ditemukan');
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    if (!data || !data.title) {
      throw new Error('Data tidak lengkap atau tidak ada title');
    }

    return {
      props: { comic: data, chapters }, // Kirim data komik dan chapter
    };
  } catch (error) {
    return {
      props: { error: error.message },
    };
  }
}


// Fungsi untuk mengambil paths dari folder konten
export async function getStaticPaths() {
  const comicsDir = path.join(process.cwd(), 'content');
  const folders = fs.readdirSync(comicsDir);

  const paths = folders.map((folder) => ({
    params: { slug: folder }, // Ambil slug dari folder yang ada
  }));

  return {
    paths,
    fallback: true, // Atur fallback ke true untuk loading page jika data tidak tersedia
  };
}

export default function Komik({ comic, chapters = [], error }) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false); // UseState moved to component

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Jika halaman sedang dimuat, tampilkan loading
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // Jika ada error, tampilkan pesan error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Pastikan data comic ada dan memiliki title
  if (!comic || !comic.title) {
    return <div>Error: Data tidak lengkap</div>;
  }


  // Fungsi untuk membuat huruf pertama menjadi besar
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };


  // Fungsi untuk menampilkan tanggal statis dalam format yang diinginkan
  const formatCreatedDate = (date) => {
    const validDate = new Date(date);

    // Cek apakah tanggal valid
    if (isNaN(validDate.getTime())) {
      // Jika tanggal tidak valid, gunakan tanggal default
      return format(new Date('2025-01-25'), 'd MMMM yyyy', { locale: id }); // Format: 25 Januari 2025
    }

    return format(validDate, 'd MMMM yyyy', { locale: id }); // Format: 25 Januari 2025
  };


  const [searchQuery, setSearchQuery] = useState(""); // State untuk menyimpan query pencarian

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase()); // Update searchQuery dengan input
  };

  // Fungsi untuk filter chapter berdasarkan pencarian
  const filteredChapters = chapters.filter((chapter) => {
    const searchTerm = searchQuery.trim();

    // Jika searchQuery kosong, tampilkan semua chapter
    if (!searchTerm) return true;

    // Filter berdasarkan nomor chapter atau nama chapter
    const chapterNumber = chapter.name.toLowerCase();
    return chapterNumber.includes(searchTerm);
  });


  return (
    <div className="bg-gray-900 text-white font-sans">
      <Navbar />
      <Sidebar />
      <main className="container mx-auto p-4">
        <div className="bg-gray-800 p-2 sm:p-6 md:p-6 rounded-lg shadow-lg mx-0 sm:mx-4 md:mx-20 lg:mx-40">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="md:w-1/3 text-center md:text-left">
              <div className="image-container">
                <img
                  alt={comic.title} // Gunakan title untuk alt image
                  className="rounded-lg w-full h-full object-cover"
                  src={comic.image} // Gunakan URL gambar dari frontmatter
                />
              </div>
            </div>
            <div className="md:w-2/3 md:pl-6 text-center md:text-left">
              <h2 className="text-xl font-bold mb-4 mt-4">{comic.title}</h2>
              <p className="mb-4">{comic.deskripsi}</p> {/* Deskripsi dari frontmatter */}
              <div className="bg-gray-700 p-4 rounded-lg mb-4">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="font-bold py-2 text-left">Author</td>
                      <td className="py-2 text-left">: <span className="ml-2">{comic.author}</span></td>
                    </tr>
                    <tr>
                      <td className="font-bold py-2 text-left">Genre</td>
                      <td className="py-2 text-left">: <span className="ml-2">{comic.genre}</span></td>
                    </tr>
                    <tr>
                      <td className="font-bold py-2 text-left">Type</td>
                      <td className="py-2 text-left">: <span className="ml-2">{comic.type}</span></td>
                    </tr>
                    <tr>
                      <td className="font-bold py-2 text-left">Status</td>
                      <td className="py-2 text-left">: <span className="ml-2">{comic.status}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-center md:justify-start mt-4 space-x-4">
                <div className="bg-gray-700 p-2 rounded-lg flex items-center space-x-2">
                  <button
                    id="bookmarkButton"
                    className={`text-3xl ${isBookmarked ? 'bg-yellow-400' : 'bg-gray-400'} text-white focus:outline-none p-1 rounded-full`}
                    onClick={handleBookmarkClick}
                  >
                    <BookmarkIcon className="h-6 w-6" />
                  </button>
                  <span className="text-lg">Bookmark</span>
                </div>

                <div className="bg-gray-700 p-2 rounded-lg flex items-center space-x-2">
                  <span className="text-lg">Views: 1.1K</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">

            <div className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
              <div className="text-center">
                <span className="text-sm text-gray-400">First Chapter</span>
                <Link href="/chapter/1">
                  <span className="chapter-link mt-2 block text-lg font-bold hover:text-blue-400">Chapter 01</span>
                </Link>
              </div>
              <div className="text-center">
                <span className="text-sm text-gray-400">New Chapter</span>
                <Link href="/chapter/10">
                  <span className="chapter-link mt-2 block text-lg font-bold hover:text-blue-400">Chapter 10</span>
                </Link>
              </div>
            </div>

            <div className="mt-4 relative"> {/* Kontainer input menggunakan relative */}
              <input
                type="text"
                placeholder="Search Chapter..."
                className="w-full p-2 pl-8 pr-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={handleSearchChange} // Panggil fungsi saat input berubah
              />
              {/* Ikon pencarian di dalam input */}
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 right-2 transform -translate-y-1/2" />
            </div>

            <div className="bg-gray-700 p-4 rounded-lg mt-2 overflow-y-auto" style={{ maxHeight: '300px' }}>
              {filteredChapters.length > 0 ? (
                filteredChapters.map((chapter, index) => (
                  <Link key={index} href={chapter.href}>
                    <span className="chapter-item flex justify-between items-center border-b border-gray-600 py-2 -mx-4 px-4">
                      <span className="hover-chapter flex-grow">
                        {capitalizeFirstLetter(chapter.name)}
                        {chapter.isNew && <sup>🔥</sup>}
                      </span>
                      <span className="text-gray-400 flex-shrink-0">
                        {formatCreatedDate(chapter.createdAt)} {/* Tampilkan tanggal statis */}
                      </span>
                    </span>
                  </Link>
                ))
              ) : (
                <p className="text-gray-400 text-center">Tidak ada chapter yang sesuai</p>
              )}
            </div>


          </div>
        </div>
      </main>

      <Footer />
      <FloatingButton />
    </div>
  );
}
