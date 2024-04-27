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
    <AppBar position="static" color={"transparent"}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Karel Čančara
        </Typography>
        {pages.map(({ buttonName, page }, index) => (
          <ModalButton key={index} buttonName={buttonName}>
            {page}
          </ModalButton>
        ))}
      </Toolbar>
    </AppBar>
  );
};
export default TopBar;
