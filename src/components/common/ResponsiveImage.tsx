'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface ResponsiveImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
  containerClassName?: string;
}

const ResponsiveImage = ({
  src,
  fallbackSrc,
  alt,
  width = 0,
  height = 0,
  containerClassName = '',
  sizes = '100vw',
  className = '',
  ...props
}: ResponsiveImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [error, setError] = useState<boolean>(false);

  const handleError = () => {
    if (!error && fallbackSrc) {
      setImgSrc(fallbackSrc);
      setError(true);
    }
  };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        onError={handleError}
        sizes={sizes}
        className={`w-full h-auto transition-transform duration-300 ${className}`}
        style={{ objectFit: 'contain' }}
        {...props}
      />
    </div>
  );
};

export default ResponsiveImage; 