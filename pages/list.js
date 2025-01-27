import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ListContent from '../components/ListContent';
import Footer from '../components/Footer';
import FloatingButton from '../components/FloatingButton';

import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

export default function List({ comics }) {
  return (
    <div className="bg-gray-900 text-white font-sans">
      <Navbar />
      <Sidebar />
      <ListContent comics={comics} />
      <Footer />
      <FloatingButton />
    </div>
  );
}

// Server-side data fetching
export async function getStaticProps() {
  const comicsDir = path.join(process.cwd(), 'content');
  const folders = fs.readdirSync(comicsDir);

  const comics = folders.map((folder) => {
    const filePath = path.join(comicsDir, folder, 'index.mdx');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    // Ambil waktu pembuatan file (modified time)
    const fileStats = fs.statSync(filePath);  // Mengambil informasi file
    const creationTime = fileStats.mtime; // waktu ketika file terakhir dimodifikasi

    return {
      ...data,
      slug: folder,
      creationTime: creationTime.toISOString(), // ubah ke format ISO string agar bisa diserialisasi
    };
  });

  // Urutkan berdasarkan waktu pembuatan terbaru (dimodifikasi)
  comics.sort((a, b) => new Date(b.creationTime) - new Date(a.creationTime));

  return {
    props: { comics },
  };
}


