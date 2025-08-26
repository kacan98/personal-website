// Social media links data
export interface Social {
  title: string;
  url: string;
  iconName: string;
}

export const socials: Social[] = [
  {
    title: "GitHub",
    url: "https://github.com/kacan98",
    iconName: "gitHub"
  },
  {
    title: "LinkedIn", 
    url: "https://www.linkedin.com/in/kcancara",
    iconName: "linkedIn"
  },
  {
    title: "Email",
    url: "mailto:karel.cancara@gmail.com", 
    iconName: "mail"
  }
];

export function getSocials() {
  return socials;
}