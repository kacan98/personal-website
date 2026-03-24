import {
  getMatchingColorPreset,
  getPresetIconPath,
  SIGNATURE_ASSET_PATHS,
} from "./constants";
import type { SocialIconPlatformName } from "./iconSources";
import type { SignatureData } from "./types";
import { getFontStack, getFontImport, getBorderRadius, getSocialPlatform, createColoredIcon } from "./utils";

const MAX_PROFILE_IMAGE_SIZE = 64;

const normalizeImageUrl = (value: string | null | undefined) => {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  return trimmed;
};

const resolveAssetUrl = (value: string, assetBaseUrl?: string) => {
  if (!value.startsWith("/")) {
    return value;
  }

  const normalizedBaseUrl = (assetBaseUrl || "").replace(/\/$/, "");
  return normalizedBaseUrl ? `${normalizedBaseUrl}${value}` : value;
};

export const generateSignatureHTML = (
  data: SignatureData,
  options?: { includeImage?: boolean; minimal?: boolean; assetBaseUrl?: string }
): string => {
  const { name, title, company, email, phone, website, profileImage, croppedImage, imageSize, imageShape, imagePosition, companyLogo, font, socialLinks, colors } = data;
  const fontFamily = getFontStack(font);
  const fontImport = getFontImport(font);
  const lineHeight = "1.4";
  const includeImage = options?.includeImage !== false;
  const minimal = options?.minimal || false;
  const assetBaseUrl = options?.assetBaseUrl;
  const avatarSize = Math.min(Math.max(imageSize || MAX_PROFILE_IMAGE_SIZE, 24), MAX_PROFILE_IMAGE_SIZE);
  const matchingPreset = getMatchingColorPreset(colors);

  const socialIconsHtml = socialLinks
    .map((link) => {
      const platform = getSocialPlatform(link.platform);
      if (!platform || !link.url) return "";

      const iconSrc = matchingPreset
        ? resolveAssetUrl(getPresetIconPath(matchingPreset.name, platform.name as SocialIconPlatformName), assetBaseUrl)
        : createColoredIcon(platform.name, colors.iconColor);

      return `<a href="${link.url}" style="display: inline-block; margin-right: 8px;" target="_blank" rel="noreferrer">
        <img src="${iconSrc}" alt="${link.platform}" width="24" height="24" style="width: 24px; height: 24px; display: block; border: none;">
      </a>`;
    })
    .join("");

  const imageToUse = resolveAssetUrl(
    normalizeImageUrl(croppedImage || profileImage) || SIGNATURE_ASSET_PATHS.profileImage,
    assetBaseUrl
  );
  const profileImageHtml = (includeImage && imageToUse)
    ? `<td style="padding-right: 15px; vertical-align: ${imagePosition === "top" ? "top" : "middle"};">
        <img src="${imageToUse}" alt="${name}" width="${avatarSize}" height="${avatarSize}" style="width: ${avatarSize}px; height: ${avatarSize}px; max-width: ${avatarSize}px; max-height: ${avatarSize}px; border-radius: ${getBorderRadius(imageShape)}; display: block; object-fit: cover; border: none;">
      </td>`
    : "";

  const hostedCompanyLogo = normalizeImageUrl(companyLogo);

  const signatureBody = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: ${fontFamily};">
    <tr>
      ${profileImageHtml}
      <td style="vertical-align: ${imagePosition === "top" ? "top" : "middle"}; padding: 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
          <tr>
            <td style="padding: 0 0 4px 0;">
              <span style="font-size: 16px; font-weight: 700; color: ${colors.nameColor}; font-family: ${fontFamily}; display: block; margin: 0; line-height: ${lineHeight};">${name}</span>
            </td>
          </tr>
          ${title ? `<tr>
            <td style="padding: 0 0 2px 0;">
              <span style="font-size: 14px; color: ${colors.titleColor}; font-family: ${fontFamily}; display: block; margin: 0; line-height: ${lineHeight};">${title}</span>
            </td>
          </tr>` : ""}
          ${company ? `<tr>
            <td style="padding: 0 0 10px 0;">
              <span style="font-size: 14px; color: ${colors.titleColor}; font-family: ${fontFamily}; display: block; margin: 0; line-height: ${lineHeight};">${company}</span>
            </td>
          </tr>` : ""}
          ${email ? `<tr>
            <td style="padding: 0 0 3px 0;">
              <span style="font-size: 13px; color: #333333; font-family: ${fontFamily}; display: block; margin: 0; line-height: ${lineHeight};">
                <a href="mailto:${email}" style="color: ${colors.linkColor}; text-decoration: none;">${email}</a>
              </span>
            </td>
          </tr>` : ""}
          ${phone ? `<tr>
            <td style="padding: 0 0 3px 0;">
              <span style="font-size: 13px; color: #333333; font-family: ${fontFamily}; display: block; margin: 0; line-height: ${lineHeight};">
                <a href="tel:${phone.replace(/\s/g, "")}" style="color: ${colors.linkColor}; text-decoration: none;">${phone}</a>
              </span>
            </td>
          </tr>` : ""}
          ${website ? `<tr>
            <td style="padding: 0 0 10px 0;">
              <span style="font-size: 13px; color: #333333; font-family: ${fontFamily}; display: block; margin: 0; line-height: ${lineHeight};">
                <a href="${website}" style="color: ${colors.linkColor}; text-decoration: none;" target="_blank" rel="noreferrer">${website.replace(/^https?:\/\//, "")}</a>
              </span>
            </td>
          </tr>` : ""}
          ${socialIconsHtml ? `<tr>
            <td style="padding: 0;">
              ${socialIconsHtml}
            </td>
          </tr>` : ""}
          ${hostedCompanyLogo ? `<tr>
            <td style="padding: 10px 0 0 0;">
              <img src="${hostedCompanyLogo}" alt="Company Logo" style="max-width: 150px; height: auto; display: block; border: none;">
            </td>
          </tr>` : ""}
        </table>
      </td>
    </tr>
  </table>`;

  if (minimal) {
    return signatureBody;
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  ${fontImport ? `<link href="${fontImport}" rel="stylesheet">` : ""}
</head>
<body style="margin: 0; padding: 0; font-family: ${fontFamily};">
  ${signatureBody}
</body>
</html>`;
};
