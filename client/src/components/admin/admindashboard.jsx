import React, { useState, useEffect } from "react";
import { 
  Drawer, List, ListItem, ListItemIcon, ListItemText, Box, CssBaseline, 
  AppBar, Toolbar, Typography, IconButton, Grid, Paper, useMediaQuery 
} from "@mui/material";
import { IoHome } from "react-icons/io5";
import { FaUsers, FaMotorcycle, FaCalendarAlt } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Routes, Route, useNavigate, Outlet } from "react-router-dom";
import Axios from "axios";
import ViewUsers from "./viewusers";
import VerifyRider from "./verifyrider";
import ViewRides from "./viewRides";
import Viewreviews from "./viewreviews";
import Fetchmessage from "./fetchmessage";
import './adminpage.css';
// import ViewRides from "./viewRides";

const sidebarWidth = 240;

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState("all"); // ✅ Fixed missing state
  const [count, setCount] = useState({ users: 0, riders: 0, bikes: 0, bookings: 0 }); // ✅ Added `bookings`
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    Axios.get(`${API_BASE_URL}/admin/viewCount`)
      .then((res) => setCount({ ...count, ...res.data })) // ✅ Ensured safe merging
      .catch((err) => console.error("Error fetching count:", err));
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      <ListItem button onClick={() => navigate("/admin")}>
        <ListItemIcon><IoHome color="white" /></ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button onClick={() => navigate("/admin/viewusers")}>
        <ListItemIcon><FaUsers color="white" /></ListItemIcon>
        <ListItemText primary={`Users (${count.users})`} />
      </ListItem>
      <ListItem button onClick={() => navigate("/admin/verifyrider")}>
        <ListItemIcon><FaMotorcycle color="white" /></ListItemIcon>
        <ListItemText primary={`Riders (${count.riders})`} />
      </ListItem>
      <ListItem button onClick={() => navigate("/admin/bookings")}>
        <ListItemIcon><FaCalendarAlt color="white" /></ListItemIcon>
        <ListItemText primary={`Bookings (${count.bookings})`} />
      </ListItem>
      <ListItem button onClick={() => navigate("/admin/viewreview")}>
        <ListItemIcon><FaCalendarAlt color="white" /></ListItemIcon>
        <ListItemText primary={`Reviews`} />
      </ListItem>
      <ListItem button onClick={() => navigate("/admin/fetchMessage")}>
        <ListItemIcon><FaCalendarAlt color="white" /></ListItemIcon>
        <ListItemText primary={`Messages`} />
      </ListItem>
      <ListItem button onClick={() => navigate("/")}>
        <ListItemIcon><AiOutlineLogout color="white" /></ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
  );

  return (
    <div className="admin-page">
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top Navbar */}
      <AppBar position="fixed" sx={{ width: `calc(100% - ${isMobile ? 0 : sidebarWidth}px)`, ml: `${isMobile ? 0 : sidebarWidth}px`, backgroundColor: "#FF9800" }}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <IconButton color="inherit" onClick={() => navigate("/")}>
            <AiOutlineLogout size={24} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarWidth,
            boxSizing: "border-box",
            backgroundColor: "#212121",
            color: "white",
          },
        }}
      >
        <Toolbar />
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {/* Counts Display */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: "center", backgroundColor: "#FF9800", color: "white" }}>
              <Typography variant="h6">Users</Typography>
              <Typography variant="h4">{count.users}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: "center", backgroundColor: "#4CAF50", color: "white" }}>
              <Typography variant="h6">Riders</Typography>
              <Typography variant="h4">{count.riders}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, textAlign: "center", backgroundColor: "#2196F3", color: "white" }}>
              <Typography variant="h6">Bookings</Typography>
              <Typography variant="h4">{count.bookings}</Typography>
            </Paper>
          </Grid>
        </Grid>
          
        <Routes>
          <Route path="/viewusers" element={<ViewUsers />} />
          <Route path="/verifyrider" element={<VerifyRider filter={filter} setFilter={setFilter} />} />
          <Route path="/bookings" element={<ViewRides />} /> 
          <Route path="/viewreview" element={<Viewreviews/>}/>
          <Route path="/fetchMessage" element={<Fetchmessage/>}/>
        </Routes>
        <Outlet />
      </Box>
    </Box>
    </div>
  );
};

export default AdminDashboard;
