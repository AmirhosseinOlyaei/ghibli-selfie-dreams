
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import LoadingAnimation from './LoadingAnimation';

interface GhibliTransformerProps {
  sourceImage: string;
  apiKey: string | null;
  provider: 'stability' | 'leonardo';
  onTransformComplete: (resultImageUrl: string) => void;
}

const GhibliTransformer: React.FC<GhibliTransformerProps> = ({
  sourceImage,
  apiKey,
  provider,
  onTransformComplete
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWithStabilityAI = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call with timeout
      // In a real app, you would make an actual API call to Stability AI
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purpose, just return the original image
      // In a real implementation, this would return the generated image from the API
      onTransformComplete(sourceImage);
      toast.success('Your Ghibli selfie has been created!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateWithLeonardoAI = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call with timeout
      // In a real app, you would make an actual API call to Leonardo AI
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purpose, just return the original image
      // In a real implementation, this would return the generated image from the API
      onTransformComplete(sourceImage);
      toast.success('Your Ghibli selfie has been created!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTransformClick = () => {
    if (provider === 'stability') {
      generateWithStabilityAI();
    } else {
      generateWithLeonardoAI();
    }
  };

  return (
    <div className="mt-8 text-center">
      {isGenerating ? (
        <div className="flex flex-col items-center">
          <LoadingAnimation />
          <p className="mt-4 text-lg">Transforming your selfie into Ghibli art...</p>
          <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
        </div>
      ) : (
        <Button 
          onClick={handleTransformClick}
          className="ghibli-button text-lg px-8 py-4"
          disabled={!sourceImage}
        >
          Transform to Ghibli Style
        </Button>
      )}
    </div>
  );
};

export default GhibliTransformer;
