import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import FloatingButton from '../../components/FloatingButton';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Next.js Link
import { BookmarkIcon, EyeIcon } from '@heroicons/react/24/outline'; // Mengimpor ikon bookmark
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabaseClient';
import Head from 'next/head';



export default function Komik({ comic, chapters = [], error }) {
  const router = useRouter();

  //Fungsi view eyeicon dengan supabase//
  const [views, setViews] = useState(0);
  const fetchViews = async (slug) => {
    try {
      const { data, error } = await supabase
        .from('views')
        .select('count')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching views:', error);
        return;
      }

      setViews(data?.count || 0);
    } catch (err) {
      console.error('Error fetching views:', err);
    }
  };

  const incrementViews = async (slug) => {
    try {
      const { data: existingView, error: fetchError } = await supabase
        .from('views')
        .select('*')
        .eq('slug', slug)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching views:', fetchError);
        return;
      }

      if (!existingView) {
        // Insert jika belum ada
        const { error: insertError } = await supabase
          .from('views')
          .insert([{ slug, count: 1 }]);

        if (insertError) console.error('Error inserting views:', insertError);
      } else {
        // Update jika sudah ada
        const { error: updateError } = await supabase
          .from('views')
          .update({ count: existingView.count + 1 })
          .eq('slug', slug);

        if (updateError) console.error('Error updating views:', updateError);
      }
    } catch (err) {
      console.error('Error incrementing views:', err);
    }
  };

  useEffect(() => {
    const { slug } = router.query;
    if (!slug) return;

    // Fetch current views
    fetchViews(slug);

    // Increment views
    incrementViews(slug);

    // Subscribe to realtime updates
    const channel = supabase
      .channel('realtime:views') // Buat channel untuk tabel views
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'views', filter: `slug=eq.${slug}` },
        (payload) => {
          setViews(payload.new.count); // Update jumlah views saat ada perubahan
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [router.query.slug]);
  ///end of function///


  ///// bookmarked berwarna ///
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
  ////end of function bokmarked////


  // Fungsi untuk membuat huruf pertama menjadi besar
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  ///end of function////


  // Fungsi untuk menampilkan tanggal statis dalam format yang diinginkan
  const formatCreatedDate = (date) => {
    // Jika tidak ada tanggal (undefined/null/empty), gunakan tanggal hari ini
    if (!date) {
      return format(new Date(), 'MMMM d, yyyy', { locale: id }); // Misal: Januari 30, 2025
    }
  
    const validDate = new Date(date);
  
    // Jika tanggal valid, gunakan yang ada, kalau tidak valid, fallback ke tanggal hari ini
    return isNaN(validDate.getTime())
      ? format(new Date(), 'MMMM d, yyyy', { locale: id })
      : format(validDate, 'MMMM d, yyyy', { locale: id });
  };
  ////end of function///////


  ////function pencarian list chapter /////
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
  ///end of function/////


  return (
    <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{comic.title}</title>
      <meta name="description" content={comic.deskripsi} />
    </Head>
    <div className="bg-gray-900 text-white font-sans">
      <Navbar />
      <Sidebar />
      <main className="container mx-auto p-4 min-h-screen">
        <div className="bg-gray-800 p-2 sm:p-6 md:p-6 rounded-lg shadow-lg mx-0 sm:mx-4 md:mx-20 lg:mx-40">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="md:w-1/3 text-center md:text-left">
              <div className="relative">
                {/* Gambar */}
                <div className="image-container">
                  <img
                    alt={comic.title} // Gunakan title untuk alt image
                    className="rounded-lg w-full h-full object-cover"
                    src={comic.image} // Gunakan URL gambar dari frontmatter
                  />
                </div>

                {/* Tombol Bookmark */}
                <div className="absolute top-2 right-2">
                  <button
                    id="bookmarkButton"
                    className={`text-3xl ${isBookmarked ? 'bg-yellow-400' : 'bg-gray-400'} text-white focus:outline-none p-1 rounded-full shadow-md`}
                    onClick={handleBookmarkClick}
                  >
                    <BookmarkIcon className="h-8 w-8" />
                  </button>
                </div>

                {/* Views Section */}
                <div className="absolute bottom-2 bg-gray-700/50 rounded-r-lg px-3 py-1 flex items-center space-x-2">
                  <EyeIcon className="h-6 w-6 text-white" /> {/* Icon Mata */}
                  <span className="text-lg text-white">{views.toLocaleString()}</span> {/* Jumlah Views */}
                </div>

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
                      <td className="py-2 text-left"> : <span className="ml-2">{comic.author}</span></td>
                    </tr>
                    <tr>
                      <td className="font-bold py-2 text-left">Tipe</td>
                      <td className="py-2 text-left"> : <span className="ml-2">{comic.type}</span></td>
                    </tr>
                    <tr>
                      <td className="font-bold py-2 text-left">Rilis</td>
                      <td className="py-2 text-left"> : <span className="ml-2">{comic.rilis}</span></td>
                    </tr>
                    <tr>
                      <td className="font-bold py-2 text-left">Status</td>
                      <td className="py-2 text-left"> : <span className="ml-2">{comic.status}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-6">

            <div className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
              {/* First Chapter diperbaiki */}
              <div className="text-center">
                <span className="text-sm text-gray-400">First Chapter</span>
                {chapters.length > 0 ? (
                  <Link href={chapters[chapters.length - 1].href}>
                    <span className="chapter-link mt-2 block text-lg font-bold hover:text-blue-400">
                      {capitalizeFirstLetter(chapters[chapters.length - 1].name)}
                    </span>
                  </Link>
                ) : (
                  <span className="chapter-link mt-2 block text-lg font-bold text-gray-500">
                    Belum Ada
                  </span>
                )}
              </div>


              {/* New Chapter */}
              <div className="text-center">
                <span className="text-sm text-gray-400">New Chapter</span>
                {chapters.length > 1 ? (
                  <Link href={chapters[0].href}>
                    <span className="chapter-link mt-2 block text-lg font-bold hover:text-blue-400">
                      {capitalizeFirstLetter(chapters[0].name)}
                    </span>
                  </Link>
                ) : (
                  <span className="chapter-link mt-2 block text-lg font-bold text-gray-500">
                    Belum Ada
                  </span>
                )}
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
    </>
  );
}


// Fungsi untuk mengambil data statis dari file MDX
export async function getStaticProps({ params }) {
  const { slug } = params;
  const comicDir = path.join(process.cwd(), 'content', slug);
  const currentDate = format(new Date(), 'dd-MM-yyyy');

  try {
    if (!fs.existsSync(comicDir)) {
      throw new Error('Folder komik tidak ditemukan');
    }

    const files = fs.readdirSync(comicDir);

    const chapters = files
      .filter((file) => file.startsWith('chapter-') && file.endsWith('.mdx')) // Filter file chapter
      .map((file) => {
        const chapterNumber = parseInt(file.match(/chapter-(\d+)/)?.[1], 10) || 0;
        return {
          href: `/komik/${slug}/${file.replace('.mdx', '')}`, // Buat link dinamis
          name: file.replace('.mdx', '').replace('-', ' '), // Format nama chapter
          number: chapterNumber, // Ambil nomor chapter
          date: currentDate, // Tambahkan properti tanggal dengan tanggal bulan dan tahun berjalan
        };
      })
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
