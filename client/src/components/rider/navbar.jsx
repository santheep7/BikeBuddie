import React from "react";
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#ff6600" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Bike Buddies
        </Typography>
        <Button color="inherit" onClick={() => navigate('/rider')}>Home</Button>
        <Button color="inherit" onClick={() => navigate('/rider/viewvehicle')}>Vehicle</Button>
        <Button color="inherit" onClick={() => navigate('/rider/riderprofile')}>Profile</Button>
        <Button
          color="inherit"
          onClick={handleClick}
        >
          Rides
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => { handleClose(); navigate('/rider/viewbooking'); }}>View Booking</MenuItem>
          <MenuItem onClick={() => { handleClose(); navigate('/rider/completedrides'); }}>Completed Rides</MenuItem>
        </Menu>
        <Button color="inherit" onClick={() => { handleClose(); navigate('/rider/viewrating'); }}>Rating</Button>
        <Button color="inherit" onClick={() => {navigate('/')
          localStorage.clear()
        }}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}
