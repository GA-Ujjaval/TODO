import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Accounts from "./Accounts";
import companylogo from "../../public/companylogo.png";

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={companylogo.src} width={150} />
            </div>
          </Typography>
          <Typography variant="h6" sx={{ flexGrow: 1, align: "center" }}>
            Todo App
          </Typography>

          <Accounts />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
