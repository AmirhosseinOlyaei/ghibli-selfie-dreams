
import React from 'react';
import ImagePreview from './ImagePreview';

interface ImageGalleryProps {
  originalImage: string | null;
  generatedImage: string | null;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ originalImage, generatedImage }) => {
  if (!originalImage) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-center mb-6">Your Images</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {originalImage && (
          <ImagePreview imageUrl={originalImage} title="Original Selfie" />
        )}
        {generatedImage && (
          <ImagePreview imageUrl={generatedImage} title="Ghibli Style" />
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
