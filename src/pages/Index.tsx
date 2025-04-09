import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageUploader from '@/components/ImageUploader';
import ApiKeyInput from '@/components/ApiKeyInput';
import GhibliTransformer from '@/components/GhibliTransformer';
import ImageGallery from '@/components/ImageGallery';
import CloudBackground from '@/components/CloudBackground';
import GhibliFilter from '@/components/GhibliFilter';

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const handleImageSelected = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setGeneratedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
  };

  const handleTransformComplete = (resultImageUrl: string) => {
    setGeneratedImage(resultImageUrl);
  };

  return (
    <div className="min-h-screen bg-ghibli-gradient relative">
      <GhibliFilter />
      <CloudBackground />
      
      <div className="container px-4 pb-12">
        <Header />
        
        <main>
          <div className="max-w-4xl mx-auto">
            <div className="mt-8 mb-12">
              <p className="text-center text-lg">
                Upload a selfie and transform it into a beautiful Ghibli-style illustration.
                <br />
                Experience the magic of becoming a character in your favorite animated world!
              </p>
            </div>
            
            {!uploadedImage && (
              <ImageUploader onImageSelected={handleImageSelected} />
            )}
            
            {uploadedImage && (
              <div className="space-y-8">
                <div className="max-w-sm mx-auto">
                  <img
                    src={uploadedImage}
                    alt="Uploaded selfie"
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                  <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
                </div>
                
                <GhibliTransformer
                  sourceImage={uploadedImage}
                  apiKey={apiKey}
                  onTransformComplete={handleTransformComplete}
                />
              </div>
            )}
            
            <ImageGallery
              originalImage={uploadedImage}
              generatedImage={generatedImage}
            />
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
