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
            }}
          >
            <IconButton
              sx={{
                position: "absolute",
                right: 0,
                top: 0,
                padding: 5,
                margin: 2,
              }}
              edge="end"
              color="inherit"
              size={"medium"}
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon fontSize={"large"} />
            </IconButton>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                boxShadow: 24,
                p: 4,
              }}
            >
              {children}
            </Box>
          </Box>
        </Slide>
      </Modal>
    </div>
  );
};

export default ModalButton;
