import { getTranslations } from "next-intl/server";
import ToolsPageContent from "@/components/pages/tools/ToolsPageContent";

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("tools");

  return (
    <ToolsPageContent
      title={t("title")}
      locale={locale}
    />
  );
}
