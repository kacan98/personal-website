"use client";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Slide,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";

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
      </Button>

      <Modal open={open} onClose={onClose} closeAfterTransition>
        <Slide direction="up" in={open} timeout={700}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              position: "absolute",
              overflow: "auto",
              bgcolor: "background.paper",
              color: "text.primary",
            }}
          >
            <IconButton
              sx={{
                position: "fixed",
                right: 50,
                top: 30,
                padding: 5,
                zIndex: 100,
                color: "text.primary",
              }}
              edge="end"
              size={"large"}
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon fontSize={"large"} />
            </IconButton>
            {children}
          </Box>
        </Slide>
      </Modal>
    </div>
  );
};

export default ModalButton;
