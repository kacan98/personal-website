import GalleryPage from "@/components/pages/galery/galleryPage";
import { getGalleries } from "@/sanity/sanity-utils";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const galleries = await getGalleries();
  
  return galleries.map((gallery) => ({
    slug: gallery.title.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default async function GalleryRoute({ params }: Props) {
  const galleries = await getGalleries();
  const gallery = galleries.find(
    (g) => g.title.toLowerCase().replace(/\s+/g, '-') === params.slug
  );

  if (!gallery) {
    notFound();
  }

  return <GalleryPage {...gallery} />;
}