import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import Footer from '../../../components/Footer';
import FloatingButton from '../../../components/FloatingButton';
import { MDXRemote } from 'next-mdx-remote'; // Import MDXRemote untuk render MDX
import { serialize } from 'next-mdx-remote/serialize'; // Import serialize untuk mengonversi MDX
import Link from 'next/link';
import { useState, useEffect } from 'react';
import BlurImage from "../../../components/BlurImage";

export const mdxComponents = {
    img: (props) => <BlurImage {...props} />,
};
  

// Fungsi untuk mengambil data chapter
// Fungsi untuk mengambil data chapter
// Fungsi untuk mengambil data chapter
export async function getStaticProps({ params }) {
    const { slug, chapterSlug } = params;
    const comicDir = path.join(process.cwd(), 'content', slug); // Ambil folder komik berdasarkan slug

    try {
        // Ambil semua file chapter dari direktori komik
        const chapterFiles = fs.readdirSync(comicDir).filter((file) => file.startsWith('chapter-') && file.endsWith('.mdx'));

        // Urutkan chapter berdasarkan nama file
       // const sortedChapters = chapterFiles.sort();
       const sortedChapters = chapterFiles.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0], 10);
        const numB = parseInt(b.match(/\d+/)[0], 10);
        return numA - numB;
    });
    

        // Temukan index chapter saat ini
        const currentIndex = sortedChapters.indexOf(`${chapterSlug}.mdx`);

        // Tentukan chapter sebelumnya dan chapter selanjutnya
        const prevChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
        const nextChapter = currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : null; // Perbaikan di sini

        // Ambil path chapter saat ini
        const chapterPath = path.join(comicDir, `${chapterSlug}.mdx`);

        // Cek apakah file chapter ada
        if (!fs.existsSync(chapterPath)) {
            throw new Error('Chapter tidak ditemukan');
        }

        const fileContent = fs.readFileSync(chapterPath, 'utf-8');
        const { data, content } = matter(fileContent); // Ambil data dan konten dari chapter

        // Jika data ada tanggal, format tanggal sebagai string yang dapat diserialisasi
        const formattedDate = data.createdAt
            ? new Date(data.createdAt).toISOString() // Ubah objek Date menjadi string (ISO format)
            : null;

        // Mengonversi konten MDX menjadi format yang bisa di-render
        const mdxSource = await serialize(content);

        return {
            props: {
                chapter: { ...data, content: mdxSource, createdAt: formattedDate }, // Ganti createdAt menjadi string
                prevChapter: prevChapter ? prevChapter.replace('.mdx', '') : null, // Kirim slug chapter sebelumnya
                nextChapter: nextChapter ? nextChapter.replace('.mdx', '') : null, // Kirim slug chapter selanjutnya
                sortedChapters, // Kirim daftar semua chapter untuk digunakan dalam logika
            },
        };
    } catch (error) {
        return {
            props: { error: error.message },
        };
    }
}


// Fungsi untuk mendapatkan paths chapter
export async function getStaticPaths() {
    const comicsDir = path.join(process.cwd(), 'content');
    const folders = fs.readdirSync(comicsDir); // Ambil semua folder komik

    const paths = [];

    // Iterasi untuk setiap folder komik
    for (const folder of folders) {
        const comicDir = path.join(comicsDir, folder);
        const files = fs.readdirSync(comicDir);

        // Ambil semua chapter yang sesuai dengan nama chapter
        const chapters = files.filter((file) => file.startsWith('chapter-') && file.endsWith('.mdx'));

        // Untuk setiap chapter, buat path
        chapters.forEach((chapter) => {
            paths.push({
                params: {
                    slug: folder, // slug komik
                    chapterSlug: chapter.replace('.mdx', ''), // nama chapter tanpa ekstensi
                },
            });
        });
    }

    return {
        paths,
        fallback: true, // Fallback jika halaman belum tersedia
    };
}

export default function Chapter({ chapter, error, prevChapter, nextChapter, sortedChapters }) {
    const router = useRouter();

    // Jika halaman sedang dimuat, tampilkan loading
    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    // Jika ada error, tampilkan pesan error
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Pastikan chapter ada
    if (!chapter || !chapter.title) {
        return <div>Error: Data chapter tidak lengkap</div>;
    }


    // Temukan index chapter saat ini
    const currentIndex = sortedChapters.indexOf(`${router.query.chapterSlug}.mdx`);

    // Tentukan apakah ini chapter pertama atau terakhir
    const isFirstChapter = currentIndex === 0;
    const isLastChapter = currentIndex === sortedChapters.length - 1;

    //blur image contetn
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 500); // Simulasi loading
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-gray-900 text-white font-sans">
            <Navbar />
            <Sidebar />
            <main className="container mx-auto p-4 min-h-screen">
                {/* Kartu dengan judul dan link */}
                <div className="bg-gray-800 p-4 sm:p-6 md:p-6 rounded-lg shadow-lg mx-0 sm:mx-4 md:mx-20 lg:mx-40 mt-6 mb-2">
                    <h2 className="text-2xl font-bold text-center mb-2">
                        {chapter.title}
                    </h2>
                    <p className="text-center text-sm text-gray-400">
                        Lihat Semua Chapter{' '}
                        <Link href={`/komik/${router.query.slug}`} className="text-yellow-400 hover:underline">
                            {chapter.title.replace(/Chapter \d+(\.\d+)?/i, '')}
                        </Link>
                    </p>

                </div>

                <div className="mb-2 p-4 sm:p-6 md:p-6 rounded-lg mx-0 sm:mx-4 md:mx-20 lg:mx-40 flex justify-between items-center">
                    {/* Tombol Sebelumnya */}
                    <Link href={`/komik/${router.query.slug}/chapter-${prevChapter?.replace('chapter-', '')}`}>
                        <button
                            className={`bg-yellow-500 text-white py-1 px-3 text-sm rounded-full hover:bg-yellow-600 transition duration-200 ${isFirstChapter ? 'cursor-not-allowed opacity-50' : ''
                                }`}
                            disabled={isFirstChapter}
                        >
                            Sebelumnya
                        </button>
                    </Link>

                    {/* Tombol Selanjutnya */}
                    <Link href={`/komik/${router.query.slug}/chapter-${nextChapter?.replace('chapter-', '')}`}>
                        <button
                            className={`bg-yellow-500 text-white py-1 px-3 text-sm rounded-full hover:bg-yellow-600 transition duration-200 ml-auto ${isLastChapter ? 'cursor-not-allowed opacity-50' : ''
                                }`}
                            disabled={isLastChapter}
                        >
                            Selanjutnya
                        </button>
                    </Link>
                </div>


                {/* Galeri Gambar */}
                <div
                    className={`bg-gray-800 p-2 sm:p-6 md:p-6 rounded-lg shadow-lg mx-0 sm:mx-4 md:mx-20 lg:mx-40 transition-all duration-700 
                    ${isLoaded ? 'blur-none opacity-100' : 'blur-md opacity-50'}`}
                >
                    <center>
                        <MDXRemote {...chapter.content} components={mdxComponents} />
                    </center>
                </div>

                <div className="mb-2 p-4 sm:p-6 md:p-6 rounded-lg mx-0 sm:mx-4 md:mx-20 lg:mx-40 flex justify-between items-center">
                    {/* Tombol Sebelumnya */}
                    <Link href={`/komik/${router.query.slug}/chapter-${prevChapter?.replace('chapter-', '')}`}>
                        <button
                            className={`bg-yellow-500 text-white py-1 px-3 text-sm rounded-full hover:bg-yellow-600 transition duration-200 ${isFirstChapter ? 'cursor-not-allowed opacity-50' : ''
                                }`}
                            disabled={isFirstChapter}
                        >
                            Sebelumnya
                        </button>
                    </Link>

                    {/* Tombol Selanjutnya */}
                    <Link href={`/komik/${router.query.slug}/chapter-${nextChapter?.replace('chapter-', '')}`}>
                        <button
                            className={`bg-yellow-500 text-white py-1 px-3 text-sm rounded-full hover:bg-yellow-600 transition duration-200 ml-auto ${isLastChapter ? 'cursor-not-allowed opacity-50' : ''
                                }`}
                            disabled={isLastChapter}
                        >
                            Selanjutnya
                        </button>
                    </Link>
                </div>
            </main>

            <Footer />
            <FloatingButton />
        </div>
    );
}
