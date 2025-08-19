import { useState, useEffect } from 'react';

const useImageCarousel = (images, interval = 3000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Preload images for better performance
  useEffect(() => {
    if (!Array.isArray(images) || images.length <= 1) {
      setIsLoading(false);
      return;
    }

    // Preload all images in the carousel
    const preloadImages = async () => {
      const loadPromises = images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => new Set(prev).add(src));
            resolve(src);
          };
          img.onerror = () => reject(src);
          img.src = src;
        });
      });

      try {
        await Promise.all(loadPromises);
        setIsLoading(false);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
        setIsLoading(false);
      }
    };

    preloadImages();
  }, [images]);

  useEffect(() => {
    // Solo crear el intervalo si hay múltiples imágenes y están cargadas
    if (!Array.isArray(images) || images.length <= 1 || isLoading) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval, isLoading]);

  // Si es un array, devolver la imagen actual, si no, devolver la imagen única
  const currentImage = Array.isArray(images) ? images[currentIndex] : images;

  return {
    currentImage,
    currentIndex,
    totalImages: Array.isArray(images) ? images.length : 1,
    isCarousel: Array.isArray(images) && images.length > 1,
    isLoading,
    loadedImages
  };
};

export default useImageCarousel;
