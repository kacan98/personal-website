import { permanentRedirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    projectSlug: string;
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { projectSlug, locale } = await params;
  permanentRedirect(`/${locale}/projects/${projectSlug}`);
}
