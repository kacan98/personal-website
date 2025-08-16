import About from "@/components/pages/about/about";

const aboutMeText = `I'm Karel, a developer who writes code for work and fun. I mostly do frontend stuff but I'm comfortable with backend too. I taught myself to code after doing marketing for a while, so I think a lot about the user experience side of things.

I work with TypeScript, Angular, React, and C# mostly. I like figuring out how things work and making them work better. When I'm not coding, I'm usually reading about new tech or trying to break something just to see if I can fix it.

Always up for interesting projects or just chatting about code.`;

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