
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file: File) => {
    // Check file type
    if (!file.type.match('image.*')) {
      toast.error('Please upload an image file (JPEG, PNG)');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image is too large. Please upload an image smaller than 10MB');
      return;
    }

    onImageSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`w-full max-w-md mx-auto mt-8 ghibli-card p-8 text-center ${
        isDragging ? 'ring-2 ring-primary' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="h-24 w-24 rounded-full bg-ghibli-blue bg-opacity-30 flex items-center justify-center animate-float">
          <Upload className="h-10 w-10 text-ghibli-blue" />
        </div>
        <h3 className="text-xl font-semibold">Upload Your Selfie</h3>
        <p className="text-muted-foreground">
          Drag and drop or click to select a photo
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <Button
          onClick={handleClick}
          className="ghibli-button"
        >
          Select Image
        </Button>
      </div>
    </div>
  );
};

export default ImageUploader;
