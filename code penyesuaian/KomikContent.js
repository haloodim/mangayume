// pages/deskripsi.js
import { useState } from 'react';
import Link from 'next/link'; // Import Next.js Link
import { BookmarkIcon } from '@heroicons/react/24/outline'; // Mengimpor ikon bookmark

export default function KomikContent() {
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleBookmarkClick = () => {
        setIsBookmarked(!isBookmarked);
    };

    return (
        <main className="container mx-auto p-4">
            <div className="bg-gray-800 p-2 sm:p-6 md:p-6 rounded-lg shadow-lg mx-0 sm:mx-4 md:mx-20 lg:mx-40">
                <div className="flex flex-col md:flex-row items-center md:items-start">
                    <div className="md:w-1/3 text-center md:text-left">
                        <div className="image-container">
                            <img
                                alt="Cover of Honey Lemon Soda Manga"
                                className="rounded-lg w-full h-full object-cover"
                                src="https://honeylemonsoda.xyz/wp-content/uploads/2024/03/Honey-Lemon-Soda-cover.webp"
                            />
                        </div>
                    </div>
                    <div className="md:w-2/3 md:pl-6 text-center md:text-left">
                        <h2 className="text-xl font-bold mb-4 mt-4">Honey Lemon Soda Manga</h2>
                        <p className="mb-4">
                            Middle school left Uka Ishimori with nothing but scars - the quiet looks, stares, and whispers from her
                            classmates made her feel like she was invisible. But, thanks to a chance encounter with a boy with
                            lemon-colored hair, she decides to change herself and make a fresh start in high school. Now in high school,
                            Uka is determined to finally make friends and get a boyfriend!
                        </p>
                        <div className="bg-gray-700 p-4 rounded-lg mb-4">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="font-bold py-2 text-left">Author(s)</td>
                                        <td className="py-2 text-left">: <span className="ml-2">MURATA Mayu</span></td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold py-2 text-left">Genre(s)</td>
                                        <td className="py-2 text-left">: <span className="ml-2">Comedy, Drama, Romance</span></td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold py-2 text-left">Type</td>
                                        <td className="py-2 text-left">: <span className="ml-2">Manga</span></td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold py-2 text-left">Released</td>
                                        <td className="py-2 text-left">: <span className="ml-2">2016</span></td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold py-2 text-left">Status</td>
                                        <td className="py-2 text-left">: <span className="ml-2">Ongoing</span></td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold py-2 text-left">Post By</td>
                                        <td className="py-2 text-left">: <span className="ml-2">Admin</span></td>
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
                    <div className="mt-4">
                        <input
                            type="text"
                            placeholder="Search Chapter..."
                            className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg mt-2 overflow-y-auto" style={{ maxHeight: '300px' }}>
                        <Link href="/chapter/10">
                            <span className="chapter-item flex justify-between items-center border-b border-gray-600 py-2 -mx-4 px-4">
                                <span className="hover-chapter flex-grow">🔥 Chapter 10 <sup><em>New</em></sup></span>
                                <span className="text-gray-400 flex-shrink-0">2 years ago</span>
                            </span>
                        </Link>
                        <Link href="/chapter/9">
                            <span className="chapter-item flex justify-between items-center border-b border-gray-600 py-2 -mx-4 px-4">
                                <span className="hover-chapter flex-grow">Chapter 9</span>
                                <span className="text-gray-400 flex-shrink-0">2 years ago</span>
                            </span>
                        </Link>
                        <Link href="/chapter/8">
                            <span className="chapter-item flex justify-between items-center border-b border-gray-600 py-2 -mx-4 px-4">
                                <span className="hover-chapter flex-grow">Chapter 8</span>
                                <span className="text-gray-400 flex-shrink-0">2 years ago</span>
                            </span>
                        </Link>
                        <Link href="/chapter/7">
                            <span className="chapter-item flex justify-between items-center border-b border-gray-600 py-2 -mx-4 px-4">
                                <span className="hover-chapter flex-grow">Chapter 7</span>
                                <span className="text-gray-400 flex-shrink-0">2 years ago</span>
                            </span>
                        </Link>
                        <Link href="/chapter/6">
                            <span className="chapter-item flex justify-between items-center border-b border-gray-600 py-2 -mx-4 px-4">
                                <span className="hover-chapter flex-grow">Chapter 6</span>
                                <span className="text-gray-400 flex-shrink-0">2 years ago</span>
                            </span>
                        </Link>
                        <Link href="/chapter/5">
                            <span className="chapter-item flex justify-between items-center border-b border-gray-600 py-2 -mx-4 px-4">
                                <span className="hover-chapter flex-grow">Chapter 5</span>
                                <span className="text-gray-400 flex-shrink-0">2 years ago</span>
                            </span>
                        </Link>
                        <Link href="/chapter/4">
                            <span className="chapter-item flex justify-between items-center border-b border-gray-600 py-2 -mx-4 px-4">
                                <span className="hover-chapter flex-grow">Chapter 4</span>
                                <span className="text-gray-400 flex-shrink-0">2 years ago</span>
                            </span>
                        </Link>
                        <Link href="/chapter/3">
                            <span className="chapter-item flex justify-between items-center border-b border-gray-600 py-2 -mx-4 px-4">
                                <span className="hover-chapter flex-grow">Chapter 3</span>
                                <span className="text-gray-400 flex-shrink-0">2 years ago</span>
                            </span>
                        </Link>
                        <Link href="/chapter/2">
                            <span className="chapter-item flex justify-between items-center border-b border-gray-600 py-2 -mx-4 px-4">
                                <span className="hover-chapter flex-grow">Chapter 2</span>
                                <span className="text-gray-400 flex-shrink-0">2 years ago</span>
                            </span>
                        </Link>
                        <Link href="/chapter/1">
                            <span className="chapter-item flex justify-between items-center border-b border-gray-600 py-2 -mx-4 px-4">
                                <span className="hover-chapter flex-grow">Chapter 1</span>
                                <span className="text-gray-400 flex-shrink-0">2 years ago</span>
                            </span>
                        </Link>
                        {/* More chapters links can be added here */}
                    </div>
                </div>
            </div>
        </main>
    );
}
