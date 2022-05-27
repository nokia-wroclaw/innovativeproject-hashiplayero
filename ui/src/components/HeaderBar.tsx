import React from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  MenuItem,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DialogChangeName from "./dynamic-components/DialogChangeName";

const HeaderBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const navigate = useNavigate();

  interface Page {
    name: string;
    path: string;
  }

  const handleCloseNavMenu = (page: Page) => {
    setAnchorElNav(null);
    if (page.path) {
      navigate(page.path);
    }
  };

  const pages = [
    { name: "Rules", path: "/rules", type: "primary" },
    { name: "Contact", path: "/contact", type: "primary" },
    { name: "Faq", path: "/faq", type: "primary" },
    { name: "Play", path: "/singleplay", type: "secondary" },
  ];

  return (
    <AppBar
      position="static"
      sx={{ height: 100 }}
      style={{ background: "white" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 80 }}>
          <div className="logo">
            <div className="logo-inner" onClick={() => navigate("/")}>
              <h5 className="logo-first-half">Hashi</h5>
              <h5 className="logo-second-half">Playero</h5>
            </div>
          </div>

          <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
            <DialogChangeName />
            {pages.map((page, index) => (
              <Button
                {...(page.type === "secondary"
                  ? { color: "secondary" }
                  : { color: "primary" })}
                key={index}
                onClick={() => handleCloseNavMenu(page)}
                sx={{ my: 2, display: "block" }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <DialogChangeName />
              {pages.map((page, index) => (
                <Button key={index} onClick={() => handleCloseNavMenu(page)} 
                sx={{ my: 2, display: "block", width:"100%", height:"100%" }}
                {...(page.type === "secondary"
                  ? { color: "secondary" }
                  : { color: "primary" })}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </Button>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default HeaderBar;
