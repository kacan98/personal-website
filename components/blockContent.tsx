import React from "react";
import { PortableText } from "@portabletext/react";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

type BlockContentProps = {
  value: any;
};

const components = {
  block: {
    h3: ({ children }: any) => (
      <Typography variant="h3" gutterBottom mt={1}>
        {children}
      </Typography>
    ),
    h4: ({ children }: any) => (
      <Typography variant="h4" gutterBottom mt={1}>
        {children}
      </Typography>
    ),
    h5: ({ children }: any) => (
      <Typography variant="h5" gutterBottom mt={1}>
        {children}
      </Typography>
    ),
    h6: ({ children }: any) => (
      <Typography variant="h6" gutterBottom mt={1}>
        {children}
      </Typography>
    ),
    normal: ({ children }: any) => (
      <Typography variant="body1">{children}</Typography>
    ),
  },
  types: {
    image: ({ value }: any) => {
      return (
        <Box m={3}>
          <Image src={value.src || value} alt={value.alt || "Image"} width={600} height={400} style={{ width: '100%', height: 'auto' }} />
        </Box>
      );
    },
  },
  marks: {
    strong: ({ children }: any) => <strong>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    link: (props: any) => <Link href={props.mark.href}>{props.children}</Link>,
  },
  list: ({ children }: any) => <ul>{children}</ul>,
  listItem: ({ children }: any) => <li>{children}</li>,
};

const BlockContent = ({ value }: BlockContentProps) => {
  return <PortableText value={value} components={components} />;
};

export default BlockContent;
