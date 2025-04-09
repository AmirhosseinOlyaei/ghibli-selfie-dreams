
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

  // Function to resize an image to the allowed dimensions
  const resizeImage = (dataUrl: string, targetWidth: number, targetHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Draw the image on the canvas with the new dimensions
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        // Get the resized image as a data URL
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve(resizedDataUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = dataUrl;
    });
  };

  const generateWithStabilityAI = async () => {
    if (!apiKey) {
      toast.error("API Key is required for image generation");
      return;
    }

    setIsGenerating(true);
    try {
      // Convert base64 image to blob for upload
      const base64Data = sourceImage.split(',')[1];
      
      // Resize the image to one of the allowed dimensions (1024x1024 is a safe choice)
      const resizedImage = await resizeImage(sourceImage, 1024, 1024);
      const resizedBase64Data = resizedImage.split(',')[1];
      
      const blob = await fetch(`data:image/jpeg;base64,${resizedBase64Data}`).then(res => res.blob());
      
      // Create form data for the API request
      const formData = new FormData();
      formData.append('init_image', blob);
      
      // Enhanced Ghibli-style prompt with specific style details
      formData.append('text_prompts[0][text]', 'Transform this image into authentic Studio Ghibli anime style, Hayao Miyazaki style, hand-drawn animation, soft pastel colors, detailed backgrounds, charming characters with large expressive eyes, whimsical atmosphere, dreamy watercolor aesthetic, nature elements, similar to Spirited Away and My Neighbor Totoro');
      formData.append('text_prompts[0][weight]', '1');
      
      // Add negative prompt to avoid unwanted elements
      formData.append('text_prompts[1][text]', 'photorealistic, 3D, CGI, photography, digital art, highly detailed faces, dark colors, gloomy, dark shadows, sharp edges');
      formData.append('text_prompts[1][weight]', '-0.5');
      
      // Set other required parameters
      formData.append('image_strength', '0.25'); // Lower value = more influence from the prompt
      formData.append('init_image_mode', 'IMAGE_STRENGTH');
      formData.append('cfg_scale', '9'); // Higher creative freedom but still guided
      formData.append('steps', '50'); // More steps for better quality
      formData.append('style_preset', 'anime'); // Use anime style preset
      
      // Make the API call to Stability AI
      const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate image');
      }

      const data = await response.json();
      
      // Get the generated image URL from the response
      const generatedImageUrl = `data:image/png;base64,${data.artifacts[0].base64}`;
      
      onTransformComplete(generatedImageUrl);
      toast.success('Your Ghibli selfie has been created!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateWithLeonardoAI = async () => {
    if (!apiKey) {
      toast.error("API Key is required for image generation");
      return;
    }
    
    setIsGenerating(true);
    try {
      // Convert base64 image to blob for upload
      const base64Data = sourceImage.split(',')[1];
      
      // Resize the image to appropriate dimensions
      const resizedImage = await resizeImage(sourceImage, 1024, 1024);
      const resizedBase64Data = resizedImage.split(',')[1];
      
      // Make the API call to Leonardo AI with improved Ghibli prompt
      const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: "Transform this image into authentic Studio Ghibli anime style, Hayao Miyazaki style, hand-drawn animation, soft pastel colors, detailed backgrounds, charming characters with large expressive eyes, whimsical atmosphere, dreamy watercolor aesthetic, nature elements, similar to Spirited Away and My Neighbor Totoro",
          negative_prompt: "photorealistic, 3D, CGI, photography, digital art, highly detailed faces, dark colors, gloomy, dark shadows, sharp edges",
          imageData: resizedBase64Data,
          modelId: "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3", // Leonardo creative model
          num_images: 1,
          guidance_scale: 9,
          alchemy: true, // Enable alchemy for better style transfer
          promptMagic: true, // Enable prompt magic for better results
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate image');
      }

      const data = await response.json();
      
      // Get the generated image URL from the response
      const generationId = data.generationId;
      
      // Poll for the result (in a real implementation we'd use websockets)
      let generatedImage = null;
      const pollInterval = setInterval(async () => {
        const pollResponse = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });
        
        const pollData = await pollResponse.json();
        
        if (pollData.generations[0].status === 'COMPLETE') {
          clearInterval(pollInterval);
          generatedImage = pollData.generations[0].imageUrl;
          onTransformComplete(generatedImage);
          toast.success('Your Ghibli selfie has been created!');
          setIsGenerating(false);
        }
      }, 2000);
      
      // Set a timeout to stop polling after 30 seconds
      setTimeout(() => {
        clearInterval(pollInterval);
        if (!generatedImage) {
          setIsGenerating(false);
          toast.error('Image generation timed out. Please try again.');
        }
      }, 30000);
      
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsGenerating(false);
    }
  };

  const handleTransformClick = () => {
    if (!apiKey) {
      toast.error("Please enter an API key before generating an image");
      return;
    }
    
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
          disabled={!sourceImage || !apiKey}
        >
          Transform to Ghibli Style
        </Button>
      )}
    </div>
  );
};

export default GhibliTransformer;
