import CvPage from "@/components/pages/cv/cvPage";
import { getCvSettings } from "@/data";
import { notFound } from "next/navigation";

interface ResumePageProps {
  params: Promise<{ locale: string }>;
}

export default async function ResumePage({ params }: ResumePageProps) {
  const { locale } = await params;
  const cvSettings = await getCvSettings(locale);
  
  if (!cvSettings.on) {
    notFound();
  }
  
  return <CvPage />;
}