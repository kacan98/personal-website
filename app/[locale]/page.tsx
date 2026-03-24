import HomePageContent from "@/components/home/HomePageContent";
import { getTranslations } from 'next-intl/server';
import { getJobsData, convertJobsToTimeline, getSocials } from '@/data';
import { getCuratedProjects } from '@/lib/cv-projects';

const technologies = [
  { name: "TypeScript", color: "#3178C6" },
  { name: "React", color: "#61DAFB" },
  { name: "Angular", color: "#DD0031" },
  { name: "Next.js", color: "#E8EDF2" },
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

  const proofPoints = [
    {
      eyebrow: t('proof.items.0.eyebrow'),
      title: t('proof.items.0.title'),
      description: t('proof.items.0.description'),
    },
    {
      eyebrow: t('proof.items.1.eyebrow'),
      title: t('proof.items.1.title'),
      description: t('proof.items.1.description'),
    },
    {
      eyebrow: t('proof.items.2.eyebrow'),
      title: t('proof.items.2.title'),
      description: t('proof.items.2.description'),
    },
  ];

  const selectedWork = (await getCuratedProjects(
    locale === 'da' || locale === 'sv' ? locale : 'en'
  )).slice(0, 3);

  const careerTimeline = convertJobsToTimeline(jobsData);

  return (
    <HomePageContent
      heroTagline={t('hero.tagline')}
      heroSubtitle={t('hero.subtitle')}
      proofHeading={t('proof.heading')}
      proofPoints={proofPoints}
      selectedWorkTitle={t('selectedWork.title')}
      selectedWork={selectedWork}
      careerTimeline={careerTimeline}
      timelineTitle={t('timeline.title')}
      technologies={technologies}
      socials={socials}
    />
  );
}
