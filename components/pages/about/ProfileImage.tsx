"use client";
import { Box, Avatar } from "@mui/material";
import { usePicture } from "@/hooks/usePicture";
import { getCVPicture } from "@/sanity/sanity-utils";

export default function ProfileImage() {
    const { imageUrl } = usePicture(getCVPicture);

    return (
        <Box
            suppressHydrationWarning
            sx={{
                width: "100%",
                aspectRatio: "1",
                backgroundColor: "grey.800",
                borderRadius: 3,
                border: "2px solid",
                borderColor: "grey.700",
                position: "relative",
                overflow: "hidden"
            }}
        >
            {imageUrl && (
                <Avatar
                    src={imageUrl}
                    alt="Karel profile picture"
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        borderRadius: 0,
                        "& img": {
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }
                    }}
                    variant="square"
                />
            )}
        </Box>
    );
}