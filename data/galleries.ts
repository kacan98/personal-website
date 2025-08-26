// Gallery data
export interface Gallery {
  title: string;
  slug: string;
  description: string;
  images: string[];
}

export const galleries: Gallery[] = [
  // Add gallery data here when needed
];

export function getGalleries() {
  return galleries;
}