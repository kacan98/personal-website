import { redirect } from "next/navigation";

interface LegacyProjectStoryProps {
  params: Promise<{ slug: string; locale: string }>;
}

const slugMap: Record<string, string> = {
  "git-jira-bridge": "git-to-jira-bridge",
};

export default async function LegacyProjectStoryRedirect({ params }: LegacyProjectStoryProps) {
  const { locale, slug } = await params;
  redirect("/" + locale + "/projects/" + (slugMap[slug] || slug));
}
