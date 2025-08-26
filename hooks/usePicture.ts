import { useState, useEffect } from "react";

export type FetchImageFunction = () => Promise<string | null> | string | null;

export function usePicture(fetchImageFunction: FetchImageFunction) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPicture = async () => {
      try {
        const result = fetchImageFunction();
        const imagePath = result instanceof Promise ? await result : result;
        if (imagePath) {
          // If it's already a full URL or starts with /, use as is
          // Otherwise assume it's a relative path
          setImageUrl(imagePath);
        }
      } catch (error) {
        console.error("Error fetching picture:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPicture();
  }, [fetchImageFunction]);

  return { imageUrl, isLoading };
}