import React from "react";
import { useNavigate } from "react-router-dom";


import { AppBar, MenuItem, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';


const HeaderBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const navigate = useNavigate();

  interface Page {
    name: string;
    path: string;
  }

  const handleCloseNavMenu = (page: Page) => {
    setAnchorElNav(null);
    navigate(page.path);
  };

  const handleCloseUserMenu = (page: Page) => {
    setAnchorElUser(null);
    navigate(page.path);
  };

  const pages = [
    { name: "Rules", path: "/rules" },
    { name: "Contact", path: "/contact" },
    { name: "Faq", path: "/faq" },
    { name: "Sign Up", path: "/signup" },
  ];

  const settings = [
    { name: "Settings", path: "/" },
    { name: "Privacy", path: "/" },
    { name: "Log out", path: "/" },
  ];
  
  return (
    <AppBar position="static" sx={{height: 80}}>
    <Container maxWidth="xl">
      <Toolbar disableGutters sx={{height: 80}}>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          HashiPlayero
        </Typography>
        
        <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' }}}>
          {pages.map((page, index) => (
            <Button
              key={index}
              onClick={() => handleCloseNavMenu(page)}
              sx={{ my: 2, display: 'block' }}
            >
              {page.name}
            </Button>
          ))}
        </Box>

        <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
          
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting, index) => (
              <MenuItem key={index} onClick={() => handleCloseUserMenu(setting)}>
                <Typography textAlign="center">{setting.name}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
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
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
           {
            pages.map((page, index) => (
              <MenuItem key={index} onClick={() => handleCloseNavMenu(page)}>
                <Typography textAlign="center">{page.name}</Typography>
              </MenuItem>
            ))
           }
          </Menu>
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
  );
};

export default HeaderBar;
