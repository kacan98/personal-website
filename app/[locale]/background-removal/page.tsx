import { getTranslations } from "next-intl/server";
import BackgroundRemovalPageContent from "@/components/pages/background-removal/BackgroundRemovalPageContent";

export default async function BackgroundRemovalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("backgroundRemoval");

  return (
    <BackgroundRemovalPageContent
      title={t("title")}
      locale={locale}
    />
  );
}
