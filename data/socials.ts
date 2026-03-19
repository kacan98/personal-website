// Social media links data
import { getMailtoHref, settings } from "@/data/settings";

export interface Social {
  title: string;
  url: string;
  iconName: string;
}

export const socials: Social[] = [
  {
    title: "GitHub",
    url: settings.githubUrl,
    iconName: "gitHub"
  },
  {
    title: "LinkedIn",
    url: settings.linkedinUrl,
    iconName: "linkedIn"
  },
  {
    title: "Email",
    url: getMailtoHref(),
    iconName: "mail"
  }
].filter((social) => social.url);

export function getSocials() {
  return socials;
}
