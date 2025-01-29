import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import HomeContent from '../components/HomeContent'
import Footer from '../components/Footer'
import FloatingButton from '../components/FloatingButton';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

export default function Home({ comics }) {
  return (
    <div className="bg-gray-900 text-white font-sans">
      <Navbar />
      <Sidebar />
      <HomeContent comics={comics} />
      <Footer />
      <FloatingButton />
    </div>
  )
}


export async function getStaticProps() {
  const comicsDir = path.join(process.cwd(), 'content');
  const folders = fs.readdirSync(comicsDir);

  const comics = folders
    .map((folder) => {
      const comicPath = path.join(comicsDir, folder);
      const filePath = path.join(comicPath, 'index.mdx');

      if (!fs.existsSync(filePath)) return null;

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);

      // Ambil waktu dari metadata
      const createdAt = data.createdAt ? new Date(data.createdAt) : new Date();

      const chapters = fs
  .readdirSync(comicPath)
  .filter((file) => file.startsWith('chapter-') && file.endsWith('.mdx'))
  .map((file) => {
    const chapterPath = path.join(comicPath, file);
    const chapterStats = fs.statSync(chapterPath);

    return {
      name: file.replace('.mdx', ''),
      number: parseInt(file.match(/\d+/)?.[0] || 0, 10),
      time: chapterStats.mtime.toISOString(), // Ubah menjadi ISO string untuk diserialisasi
      createdAt: chapterStats.mtime.toISOString(), // Ubah menjadi ISO string untuk diserialisasi
    };
  })
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Urutkan berdasarkan createdAt




      if (chapters.length === 0) return null;

      return {
        ...data,
        slug: folder,
        creationTime: createdAt.toLocaleDateString('id-ID'),
        chapters: chapters.slice(0, 2), // Ambil dua chapter terbaru
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.chapters[0]?.time) - new Date(a.chapters[0]?.time)); // Urutkan berdasarkan waktu chapter terbaru

  return {
    props: { comics },
  };
}




