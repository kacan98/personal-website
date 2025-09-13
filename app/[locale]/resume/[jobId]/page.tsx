import { getCvSettings } from "@/data";
import { notFound, redirect } from "next/navigation";

interface ResumeJobPageProps {
  params: Promise<{
    locale: string;
    jobId: string;
  }>;
}

export default async function ResumeJobPage({ params }: ResumeJobPageProps) {
  const { locale, jobId } = await params;
  const cvSettings = await getCvSettings(locale);

  if (!cvSettings.on) {
    notFound();
  }

  // Redirect to the unified CV route with job ID
  redirect(`/${locale}/cv/${jobId}`);
}