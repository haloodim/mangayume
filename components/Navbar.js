import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
        <Link href="/" className="flex items-center">
    <img
      alt="Mangamas Logo"
      className="rounded-full"
      height="40"
      src="https://storage.googleapis.com/a1aa/image/d51vAcCdQNJ0LxoDwiJ7Se6biVKey9UnxfQ9BsWZBvw1A7QoA.jpg"
      width="40"
    />
    <h1 className="text-2xl font-bold ml-2">Mangamas</h1>
  </Link>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-400">Beranda</Link>
          <Link href="/project" className="hover:text-gray-400">Project</Link>
          <Link href="/list" className="hover:text-gray-400">Daftar Komik</Link>
          <Link href="#" className="hover:text-gray-400">Bookmark</Link>
          <Link href="#" className="hover:text-gray-400">Tentang</Link>
        </nav>
      </div>
    </header>
  )
}
