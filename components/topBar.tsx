import { AppBar, Button, Toolbar, Typography } from "@mui/material";

const TopBar = () => (
  <AppBar position="static" color={"transparent"}>
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Karel&apos;s Next.js App
      </Typography>
      {["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"].map(
        (option, index) => (
          <Button sx={{ my: 2, color: "white", display: "block" }} key={option}>
            <Typography variant="body1" key={index}>
              {option}
            </Typography>
          </Button>
        ),
      )}
    </Toolbar>
  </AppBar>
);

export default TopBar;
