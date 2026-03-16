import { redirect } from "next/navigation";

interface PortfolioProps {
  params: Promise<{ locale: string }>;
}

export default async function PortfolioRedirect({ params }: PortfolioProps) {
  const { locale } = await params;
  redirect("/" + locale + "/projects");
}
