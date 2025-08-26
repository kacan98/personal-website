import GalleryPage from "@/components/pages/galery/galleryPage";
import { getGalleries } from "@/data";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const galleries = getGalleries();
  
  if (!galleries || !Array.isArray(galleries)) {
    return [];
  }
  
  return galleries.map((gallery) => ({
    slug: gallery.title.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default async function GalleryRoute({ params }: Props) {
  const { slug } = await params;
  const galleries = getGalleries();
  
  if (!galleries || !Array.isArray(galleries)) {
    notFound();
  }
  
  const gallery = galleries.find(
    (g) => g.title.toLowerCase().replace(/\s+/g, '-') === slug
  );

  if (!gallery) {
    notFound();
  }

  return <GalleryPage {...gallery} />;
}