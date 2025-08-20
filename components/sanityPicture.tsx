"use client";
import { useNextSanityImage } from "next-sanity-image";
import { sanityClient } from "@/sanity/lib/sanityClient";
import { Image as SanityImage } from "sanity";
import Image from "next/image";
import { FitMode } from "@sanity/image-url/lib/types/types";

interface SanityPicturePropsBase {
  sanityImage: SanityImage;
  alt: string;
  fitMode?: FitMode;
}

interface SanityPictureFixedProps extends SanityPicturePropsBase {
  width?: number;
  height?: number;
  fill?: false;
}

interface SanityPictureResponsiveProps extends SanityPicturePropsBase {
  fill: true;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

type SanityPictureProps =
  | SanityPictureFixedProps
  | SanityPictureResponsiveProps;

function SanityPicture({ sanityImage, alt, ...props }: SanityPictureProps) {
  const imageProps = useNextSanityImage(sanityClient, sanityImage, {
    imageBuilder: (builder, options) => {
      // Always use the width from options if available (fixes Next.js 15 warning)
      if (options.width !== null && options.width !== undefined) {
        builder.width(options.width);
      } else if (!props?.fill && props.width) {
        builder.width(props.width);
      }
      
      if (!props?.fill && props.height) {
        builder.height(props.height);
      }

      if (props.fitMode) {
        builder.fit(props.fitMode);
      }

      return builder;
    },
  });

  // avoid Image with src "xyz" has both "width" and "fill" properties. Only one should be used.

  return props.fill ? (
    <Image
      src={imageProps.src}
      alt={alt}
      loader={imageProps.loader}
      fill // layout="fill" prior to Next 13.0.0
      objectFit={props.objectFit || "contain"}
    />
  ) : (
    <Image
      {...imageProps}
      alt={alt}
      style={{ width: "100%", height: "auto" }}
      sizes="(max-width: 800px) 100vw, 800px"
    />
  );
}

export default SanityPicture;
