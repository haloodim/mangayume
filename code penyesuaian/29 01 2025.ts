import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import HomeContent from '../components/HomeContent'
import Footer from '../components/Footer'
import FloatingButton from '../components/FloatingButton';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

export default function Home({comics}) {
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

      const fileStats = fs.statSync(filePath);
      const creationTime = fileStats.mtime;

      // Fungsi untuk format tanggal tanpa waktu
      const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
          year: '2-digit',
          month: 'long',
          day: 'numeric',
        });
      };

      const chapters = fs
        .readdirSync(comicPath)
        .filter((file) => file.startsWith('chapter-') && file.endsWith('.mdx'))
        .map((file) => ({
          name: file.replace('.mdx', ''),
          number: parseInt(file.match(/\d+/)?.[0] || 0, 10),
          // Tanpa waktu di SSR
          time: '', 
        }))
        .sort((a, b) => b.number - a.number);

      if (chapters.length === 0) return null;

      const isNew = new Date(chapters[0].time).getTime() > creationTime.getTime();

      return {
        ...data,
        slug: folder,
        creationTime: formatDate(creationTime),
        chapters: chapters.slice(0, 2),
        isNew,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.isNew && !a.isNew) return 1;
      if (!b.isNew && a.isNew) return -1;
      return new Date(b.chapters[0]?.time) - new Date(a.chapters[0]?.time);
    });

  return {
    props: { comics },
  };
}






