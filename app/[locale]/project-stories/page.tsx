import { redirect } from "next/navigation";

interface ProjectStoriesProps {
  params: Promise<{ locale: string }>;
}

export default async function ProjectStoriesRedirect({ params }: ProjectStoriesProps) {
  const { locale } = await params;
  redirect("/" + locale + "/projects");
}
