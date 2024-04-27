"use client";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Slide,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

type ModalButtonProps = {
  buttonName: string;
  children: ReactNode;
};

const ModalButton = ({ buttonName, children }: ModalButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button
        size={"large"}
        color={"info"}
        sx={{ my: 2, display: "block" }}
        onClick={handleOpen}
      >
        <Typography variant="button">{buttonName}</Typography>
      </Button>
      <Modal open={open} onClose={handleClose} closeAfterTransition>
        <Slide direction="up" in={open} timeout={700}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              position: "absolute",
              bgcolor: "background.paper",
              overflow: "auto",
            }}
          >
            <IconButton
              sx={{
                position: "fixed",
                right: 50,
                top: 30,
                padding: 5,
                zIndex: 100,
              }}
              edge="end"
              color="inherit"
              size={"medium"}
              onClick={handleClose}
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
