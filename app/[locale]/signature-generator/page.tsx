import { getTranslations } from "next-intl/server";
import EmailGeneratorPageContent from "@/components/pages/email-generator/EmailGeneratorPageContent";

export default async function EmailGeneratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("emailGenerator");

  return (
    <EmailGeneratorPageContent
      title={t("title")}
      locale={locale}
    />
  );
}
