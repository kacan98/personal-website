import About from "@/components/pages/about/about";

const aboutMeText = `Karel Čančara is a full-stack developer specializing in frontend development with comprehensive backend expertise. With a unique background combining marketing and software engineering, he builds user-centric solutions using TypeScript, Angular, React, and C#.

Self-taught and continuously learning, Karel contributes to enterprise software development across the full technology stack. He brings curiosity, user advocacy, and collaborative skills to every project.

Open to challenging opportunities and continuous professional growth.`;

export default function AboutPage() {
  return (
    <About
      heading={"About me"}
      bodyContent={aboutMeText}
      buttonText="Shoot me a message"
      buttonHref="mailto:karel.cancara@gmail.com"
    />
  );
}