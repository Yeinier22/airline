import React, { useState } from 'react';
import useImageCarousel from '../hooks/useImageCarousel';
import styles from './DestinationImage.module.css';

const DestinationImage = ({ 
  images, 
  alt, 
  className = '',
  interval = 3000,
  showIndicators = false 
}) => {
  const { currentImage, currentIndex, totalImages, isCarousel, isLoading } = useImageCarousel(images, interval);
  const [hasError, setHasError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setHasError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const imageSrc = hasError ? '/images/placeholder.jpg' : currentImage;

  return (
    <div className={`${styles.imageContainer} ${className}`}>
      {/* Loading placeholder */}
      {(isLoading || !imageLoaded) && !hasError && (
        <div className={styles.placeholder}>
          <div className={styles.skeleton}></div>
        </div>
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        className={`${styles.image} ${imageLoaded ? styles.loaded : styles.loading}`}
        loading="lazy"
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ opacity: imageLoaded ? 1 : 0 }}
      />
      
      {/* Indicadores de carrusel - solo si hay múltiples imágenes y showIndicators es true */}
      {isCarousel && showIndicators && !hasError && imageLoaded && (
        <div className={styles.indicators}>
          {Array.from({ length: totalImages }, (_, index) => (
            <div
              key={index}
              className={`${styles.indicator} ${
                index === currentIndex ? styles.active : ''
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DestinationImage;
