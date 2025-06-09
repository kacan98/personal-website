"use client";
import BackgroundEffect from "@/components/background/BackgroundEffect";
import {
  Box,
  Button,
  Modal,
  Slide,
  Typography
} from "@mui/material";
import { ReactNode } from "react";

type ModalButtonProps = {
  buttonName: string;
  children: ReactNode;
  onOpen: () => void;
  onClose: () => void;
  open: boolean;
};

const ModalButton = ({
  buttonName,
  children,
  onOpen,
  onClose,
  open,
}: ModalButtonProps) => {
  return (
    <div>
      <Button
        size={"large"}
        color={"primary"}
        sx={{ my: 2, display: "block" }}
        onClick={onOpen}
      >
        <Typography variant="button" fontSize="1.2rem" fontWeight={700}>
          {buttonName}
        </Typography>
      </Button>      <Modal open={open} onClose={onClose} closeAfterTransition>
        <Slide direction="up" in={open} timeout={500}>
          <div>
            <Box sx={{
              width: "100%",
              height: "100%",
              position: "absolute",
              overflow: "auto",
              bgcolor: "#0f172a", // Match the main layout background
              color: "text.primary",
            }}>
              <BackgroundEffect />
              {children}
            </Box>
          </div>
        </Slide>
      </Modal>
    </div>
  );
};

export default ModalButton;
