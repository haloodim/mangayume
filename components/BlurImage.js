import { useState } from "react";

const BlurImage = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  //cek komentar
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`transition-all duration-700 ${
        isLoaded ? "blur-none" : "blur-md"
      }`}
      onLoad={() => setIsLoaded(true)}
    />
  );
};

export default BlurImage;
