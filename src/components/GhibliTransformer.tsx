import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import LoadingAnimation from "./LoadingAnimation"

interface GhibliTransformerProps {
  sourceImage: string
  apiKey: string | null
  onTransformComplete: (resultImageUrl: string) => void
}

const GhibliTransformer: React.FC<GhibliTransformerProps> = ({
  sourceImage,
  apiKey,
  onTransformComplete,
}) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const resizeImage = (
    dataUrl: string,
    targetWidth: number,
    targetHeight: number
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = targetWidth
        canvas.height = targetHeight
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
        const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.9)
        resolve(resizedDataUrl)
      }

      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = dataUrl
    })
  }

  const handleDownload = () => {
    if (!generatedImage) return

    // Create a temporary link element
    const link = document.createElement("a")
    link.href = generatedImage
    link.download = "ghibli-portrait.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Download started!")
  }

  const handleTransformComplete = (imageUrl: string) => {
    setGeneratedImage(imageUrl)
    onTransformComplete(imageUrl)
  }

  const generateWithStabilityAI = async () => {
    if (!apiKey || apiKey.trim() === "") {
      toast.error("Please enter a valid Stability AI API key")
      return
    }

    if (!apiKey.startsWith("sk-")) {
      toast.error(
        "Invalid Stability AI API key format. It should start with 'sk-'"
      )
      return
    }

    setIsGenerating(true)
    try {
      const resizedImage = await resizeImage(sourceImage, 1024, 1024)
      const resizedBase64Data = resizedImage.split(",")[1]

      const blob = await fetch(
        `data:image/jpeg;base64,${resizedBase64Data}`
      ).then((res) => res.blob())

      const formData = new FormData()
      formData.append("init_image", blob)

      // --- Trending Ghibli-style Anime Prompt ---
      const prompt =
        "portrait in Studio Ghibli anime style, soft lighting, big expressive eyes and smile, whimsical charm, pastel color palette, detailed face, Hayao Miyazaki aesthetic, cinematic lighting, trending on artstation, anime illustration"
      const negativePrompt =
        "blurry, distorted, extra limbs, cropped, deformed eyes, poorly drawn hands, low quality, watermark"

      formData.append("text_prompts[0][text]", prompt)
      formData.append("text_prompts[0][weight]", "1")
      formData.append("text_prompts[1][text]", negativePrompt)
      formData.append("text_prompts[1][weight]", "-1")

      formData.append("image_strength", "0.4") // More stylization
      formData.append("cfg_scale", "10") // Creativity/faithfulness balance
      formData.append("samples", "1")
      formData.append("steps", "50")
      formData.append("style_preset", "anime") // Optional: "fantasy-art" also works well
      formData.append("seed", `${Math.floor(Math.random() * 1000000)}`)

      const response = await fetch(
        "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: "application/json",
          },
          body: formData,
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          `Stability API Error: ${errorData.message || response.statusText}`
        )
      }

      const data = await response.json()
      const generatedImageUrl = `data:image/png;base64,${data.artifacts[0].base64}`

      if (!generatedImageUrl) {
        throw new Error("No image data returned from Stability AI")
      }

      handleTransformComplete(generatedImageUrl)
      toast.success("Ghibli-style portrait generated!")
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "An error occurred during image generation.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClick = () => {
    generateWithStabilityAI()
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        onClick={handleClick}
        disabled={isGenerating}
        className="bg-ghibli-peach hover:bg-ghibli-peach-dark"
      >
        {isGenerating ? <LoadingAnimation /> : "Transform to Ghibli Portrait"}
      </Button>
      {generatedImage && (
        <Button
          onClick={handleDownload}
          className="mt-4 bg-ghibli-purple hover:bg-ghibli-purple-dark"
        >
          Download Portrait
        </Button>
      )}
    </div>
  )
}

export default GhibliTransformer
