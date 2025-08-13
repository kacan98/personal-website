import CvPage from "@/components/pages/cv/cvPage";
import { getCvSettings } from "@/sanity/sanity-utils";
import { notFound } from "next/navigation";

export default async function ResumePage() {
  const cvSettings = await getCvSettings();
  
  if (!cvSettings.on) {
    notFound();
  }
  
  return <CvPage />;
}