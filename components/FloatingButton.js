// components/FloatingButton.js
import { useState, useEffect } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/solid'; // Import ikon dari Heroicons

const FloatingButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    isVisible && (
      <div
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 sm:p-4 md:p-4 lg:p-3 xl:p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all cursor-pointer"
        onClick={scrollToTop}
      >
        <ArrowUpIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-7 md:w-7 lg:h-7 lg:w-7 xl:h-7 xl:w-7" />
      </div>
    )
  );
};

export default FloatingButton;
