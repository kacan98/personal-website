import { AppBar, Card, CardContent, Toolbar, Typography } from "@mui/material";
import ModalButton from "@/components/modalButton";
import { ReactNode } from "react";

const TopBar = () => {
  const pages: {
    buttonName: string;
    page: ReactNode;
  }[] = [
    {
      buttonName: "Portfolio",
      page: (
        <>
          <Card>
            <CardContent>
              <Typography variant="h6">Portfolio</Typography>
              <Typography variant="body1">
                This is a portfolio page. It is a simple example of a modal
                dialog.
              </Typography>
            </CardContent>
          </Card>
        </>
      ),
    },
  ];
  return (
    <AppBar position="static" color={"transparent"}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Karel&apos;s Next.js App
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
