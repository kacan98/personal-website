"use client";
import { useNextSanityImage } from "next-sanity-image";
import { sanityClient } from "@/sanity/lib/sanityClient";
import { Image as SanityImage } from "sanity";
import Image from "next/image";

type SanityPictureProps = {
  sanityImage: SanityImage;
  alt: string;
  layout?: "fill" | "responsive" | "intrinsic" | undefined;
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down" | undefined;
  objectPosition?: string;
  unoptimized?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: "empty" | "blur" | undefined;
  blurDataURL?: string;
  sizes?: string;
  width?: number;
  height?: number;
  fill?: boolean;
};

function SanityPicture({
  sanityImage,
  alt,
  fill,
  width: widthProp,
  height: heightProp,
  ...props
}: SanityPictureProps) {
  const {
    // width: imageWidth,
    // height: imageHeight,
    src,
    loader,
  } = useNextSanityImage(sanityClient, sanityImage);

  // avoid Image with src "xyz" has both "width" and "fill" properties. Only one should be used.

  return fill ? (
    <Image fill {...props} src={src} alt={alt} />
  ) : (
    <Image
      {...props}
      src={src}
      alt={alt}
      width={widthProp}
      height={heightProp}
      loader={loader}
    />
  );
}

export default SanityPicture;
