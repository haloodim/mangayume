import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import Footer from '../../../components/Footer';
import FloatingButton from '../../../components/FloatingButton';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { MDXRemote } from 'next-mdx-remote'; // Import MDXRemote untuk render MDX
import { serialize } from 'next-mdx-remote/serialize'; // Import serialize untuk mengonversi MDX


// Fungsi untuk mengambil data chapter
export async function getStaticProps({ params }) {
    const { slug, chapterSlug } = params;
    const comicDir = path.join(process.cwd(), 'content', slug); // Ambil folder komik berdasarkan slug

    try {
        const chapterPath = path.join(comicDir, `${chapterSlug}.mdx`); // Ambil path chapter

        // Cek apakah file chapter ada
        if (!fs.existsSync(chapterPath)) {
            throw new Error('Chapter tidak ditemukan');
        }

        const fileContent = fs.readFileSync(chapterPath, 'utf-8');
        const { data, content } = matter(fileContent); // Ambil data dan konten dari chapter

        // Jika data ada tanggal, format tanggal
        const formattedDate = data.createdAt
            ? format(new Date(data.createdAt), 'd MMMM yyyy', { locale: id })
            : null;

        // Mengonversi konten MDX menjadi format yang bisa di-render
        const mdxSource = await serialize(content);

        return {
            props: { chapter: { ...data, content: mdxSource, formattedDate } },
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

export default function Chapter({ chapter, error }) {
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

      

    return (
        <div className="bg-gray-900 text-white font-sans">
            <Navbar />
            <Sidebar />
            <main className="container mx-auto p-4 min-h-screen">
                {/* Kartu dengan judul dan link */}
                <div className="bg-gray-800 p-4 sm:p-6 md:p-6 rounded-lg shadow-lg mx-0 sm:mx-4 md:mx-20 lg:mx-40 mt-6 mb-2">
                    <h2 className="text-2xl font-bold text-center mb-2">
                        I Took Over The System Players Ch. 128 Bahasa Indonesia
                    </h2>
                    <p className="text-center text-sm text-gray-400">
                        Lihat Semua Chapter{' '}
                        <a href="#" className="text-blue-400 hover:underline">
                            I Took Over The System Players
                        </a>
                    </p>
                </div>

                {/* Kartu dengan tombol "Sebelumnya" dan "Selanjutnya" */}
                <div className="mb-2 p-4 sm:p-6 md:p-6 rounded-lg mx-0 sm:mx-4 md:mx-20 lg:mx-40 flex justify-between items-center">
                    <button className="bg-blue-500 text-white py-1 px-3 text-sm rounded-full hover:bg-blue-600 transition duration-200">
                        Sebelumnya
                    </button>
                    <button className="bg-blue-500 text-white py-1 px-3 text-sm rounded-full hover:bg-blue-600 transition duration-200">
                        Selanjutnya
                    </button>
                </div>

                {/* Galeri Gambar */}
                <div className="bg-gray-800 p-2 sm:p-6 md:p-6 rounded-lg shadow-lg mx-0 sm:mx-4 md:mx-20 lg:mx-40">
                    <center>
                    <MDXRemote {...chapter.content} />
                    </center>
                </div>

                {/* Kartu dengan tombol "Sebelumnya" dan "Selanjutnya" */}
                <div className="mb-4 p-4 sm:p-6 md:p-6 rounded-lg mx-0 sm:mx-4 md:mx-20 lg:mx-40 flex justify-between items-center">
                    <button className="bg-blue-500 text-white py-1 px-3 text-sm rounded-full hover:bg-blue-600 transition duration-200">
                        Sebelumnya
                    </button>
                    <button className="bg-blue-500 text-white py-1 px-3 text-sm rounded-full hover:bg-blue-600 transition duration-200">
                        Selanjutnya
                    </button>
                </div>
            </main>

            <Footer />
            <FloatingButton />
        </div>
    );
}
