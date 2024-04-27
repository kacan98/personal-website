import { AppBar, Toolbar, Typography } from "@mui/material";
import ModalButton from "@/components/menu/modalButton";
import { ReactNode } from "react";

type TopBarProps = {
  pages: {
    buttonName: string;
    page: ReactNode;
  }[];
};

const TopBar = ({ pages }: TopBarProps) => {
  return (
    <AppBar
      position="static"
      color={"transparent"}
      sx={{
        boxShadow: "none",
      }}
    >
      <Toolbar>
        {pages.map(({ buttonName, page }, index) => (
          <ModalButton key={index} buttonName={buttonName}>
            {page}
          </ModalButton>
        ))}
        <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
      </Toolbar>
    </AppBar>
  );
};
export default TopBar;
