
import React from 'react';

interface ImagePreviewProps {
  imageUrl: string;
  title: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, title }) => {
  return (
    <div className="ghibli-card p-4 overflow-hidden">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="relative w-full aspect-square overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ImagePreview;
