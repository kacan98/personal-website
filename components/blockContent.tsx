import React from "react";
import { PortableText } from "@portabletext/react";
import type {
  PortableTextBlock,
  PortableTextMarkComponentProps,
  PortableTextReactComponents,
} from "@portabletext/react";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

type BlockContentProps = {
  value: PortableTextBlock[];
};

type ChildrenProps = {
  children?: ReactNode;
};

type ImageValue = {
  src?: string;
  alt?: string;
};

type LinkMark = {
  _type: string;
  href?: string;
};

function getImageSrc(value: ImageValue | string): string {
  return typeof value === "string" ? value : (value.src || "");
}

function getImageAlt(value: ImageValue | string): string {
  return typeof value === "string" ? "Image" : (value.alt || "Image");
}

const components: Partial<PortableTextReactComponents> = {
  block: {
    h3: ({ children }: ChildrenProps) => (
      <Typography variant="h3" gutterBottom mt={1}>
        {children}
      </Typography>
    ),
    h4: ({ children }: ChildrenProps) => (
      <Typography variant="h4" gutterBottom mt={1}>
        {children}
      </Typography>
    ),
    h5: ({ children }: ChildrenProps) => (
      <Typography variant="h5" gutterBottom mt={1}>
        {children}
      </Typography>
    ),
    h6: ({ children }: ChildrenProps) => (
      <Typography variant="h6" gutterBottom mt={1}>
        {children}
      </Typography>
    ),
    normal: ({ children }: ChildrenProps) => (
      <Typography variant="body1">{children}</Typography>
    ),
  },
  types: {
    image: ({ value }: { value: ImageValue | string }) => {
      return (
        <Box m={3}>
          <Image src={getImageSrc(value)} alt={getImageAlt(value)} width={600} height={400} style={{ width: '100%', height: 'auto' }} />
        </Box>
      );
    },
  },
  marks: {
    strong: ({ children }: ChildrenProps) => <strong>{children}</strong>,
    em: ({ children }: ChildrenProps) => <em>{children}</em>,
    link: ({ children, value }: PortableTextMarkComponentProps<LinkMark>) => (
      <Link href={value?.href || "#"}>{children}</Link>
    ),
  },
  list: ({ children }: ChildrenProps) => <ul>{children}</ul>,
  listItem: ({ children }: ChildrenProps) => <li>{children}</li>,
};

const BlockContent = ({ value }: BlockContentProps) => {
  return <PortableText value={value} components={components} />;
};

export default BlockContent;
