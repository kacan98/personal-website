import HomePageContent from "@/components/home/HomePageContent";
import { getTranslations } from 'next-intl/server';
import { getJobsData, convertJobsToTimeline, getSocials } from '@/data';


// Example technologies array for the TechList component
const technologies = [
  { name: "TypeScript", color: "#3178C6" },
  { name: "React", color: "#61DAFB" },
  { name: "Angular", color: "#DD0031" },
  { name: "Next.js", color: "#000000" },
  { name: "C#", color: "#239120" },
  { name: ".NET", color: "#512BD4" },
  { name: "X++", color: "#0078D4" },
  { name: "Node.js", color: "#339933" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "Azure", color: "#0089D0" },
  { name: "AI/ML", color: "#FF6B6B" },
  { name: "Drizzle", color: "#C5F74F" },
];

export default async function App({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('homepage');
  const jobsData = getJobsData(locale);
  const socials = getSocials();
  
  const aboutMe = {
    fullStack: {
      header: t('about.fullStack.header'),
      content: t('about.fullStack.content'),
      visualType: 'laptop' as const
    },
    aiEnhanced: {
      header: t('about.aiEnhanced.header'), 
      content: t('about.aiEnhanced.content'),
      visualType: 'ai' as const
    },
    problemSolver: {
      header: t('about.problemSolver.header'),
      content: t('about.problemSolver.content'),
      visualType: 'problem' as const
    },
    userFocused: {
      header: t('about.userFocused.header'),
      content: t('about.userFocused.content'),
      visualType: 'user' as const
    },
  };

  // Convert jobs data to timeline format
  const careerTimeline = convertJobsToTimeline(jobsData);

  return (
    <HomePageContent 
      heroTagline={t('hero.tagline')}
      aboutMe={aboutMe}
      careerTimeline={careerTimeline}
      timelineTitle={t('timeline.title')}
      technologies={technologies}
      socials={socials}
    />
  );
}