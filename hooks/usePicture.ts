import { useState, useEffect, useCallback } from "react";
import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "@/sanity/lib/sanityClient";
import { Image } from "sanity";

export type FetchImageFunction = () => Promise<Image | null>;

export function usePicture(fetchImageFunction: FetchImageFunction) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const urlFor = useCallback((source: Image) => {
    const builder = imageUrlBuilder(sanityClient);
    return builder.image(source).url();
  }, []);

  useEffect(() => {
    const fetchPicture = async () => {
      try {
        const image = await fetchImageFunction();
        if (image) {
          const url = urlFor(image);
          setImageUrl(url);
        }
      } catch (error) {
        console.error("Error fetching picture:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPicture();
  }, [fetchImageFunction, urlFor]);

  return { imageUrl, isLoading };
}