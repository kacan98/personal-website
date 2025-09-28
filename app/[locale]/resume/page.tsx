import { getCvSettings } from "@/data/cv-server";
import { notFound, redirect } from "next/navigation";

interface ResumePageProps {
  params: Promise<{ locale: string }>;
}

export default async function ResumePage({ params }: ResumePageProps) {
  const { locale } = await params;
  const cvSettings = await getCvSettings(locale);

  if (!cvSettings.on) {
    notFound();
  }

  // Redirect to the unified CV route
  redirect(`/${locale}/cv`);
}