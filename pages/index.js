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

  // Baca data chapter dari file JSON
  const chaptersFilePath = path.join(process.cwd(), 'data', 'chapters.json');
  const chaptersData = JSON.parse(fs.readFileSync(chaptersFilePath, 'utf-8'));

  const comics = folders
    .map((folder) => {
      const comicPath = path.join(comicsDir, folder);
      const filePath = path.join(comicPath, 'index.mdx');

      if (!fs.existsSync(filePath)) return null;

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);

      // Temukan data chapter yang sesuai dengan slug
      const comicChapters = chaptersData.find(comic => comic.slug === folder)?.chapters || [];

      const chapters = comicChapters
        .map((chapter) => ({
          name: chapter.name,
          number: chapter.number,
          createdAt: chapter.createdAt, // Gunakan createdAt dari data JSON
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Urutkan berdasarkan createdAt

      if (chapters.length === 0) return null;

      return {
        ...data,
        slug: folder,
        creationTime: new Date(data.createdAt).toLocaleDateString('id-ID'),
        chapters: chapters.slice(0, 2), // Ambil dua chapter terbaru
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.chapters[0]?.createdAt) - new Date(a.chapters[0]?.createdAt)); // Urutkan berdasarkan waktu chapter terbaru

  return {
    props: { comics }
  };
}