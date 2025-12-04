import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Container, Box, Typography, Grid, Avatar, TextField, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { gsap } from 'gsap';
import axios from 'axios';
import ReactStars from 'react-stars';  // Import react-stars
import slider1 from '../images/slide1.webp';

const navbarStyles = {
  backgroundColor: '#333',
  boxShadow: 'none',
};

const buttonHoverStyles = {
  position: 'relative',
  color: 'white',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: '0%',
    height: '2px',
    backgroundColor: 'white',
    left: '50%',
    bottom: '-2px',
    transition: 'width 0.3s ease, left 0.3s ease',
  },
  '&:hover:after': {
    width: '100%',
    left: '0%',
  },
};

const buttonStyles = {
  marginLeft: '10px', 
  backgroundColor: '#ff7043',
  color: 'white',
  '&:hover': {
    backgroundColor: '#f4511e',
  },
};

const buttonStyles1 = { 
  backgroundColor: '#ff7043',
  color: 'white',
  '&:hover': {
    backgroundColor: '#f4511e',
  },
};

const defaultAvatar = "https://www.w3schools.com/howto/img_avatar.png"; // Dummy avatar URL

const HomePage = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [reviews, setReviews] = useState([]);
  
  // Contact form state
  const [contact, setContact] = useState({
    Name: '',
    Email: '',
    Message: '',
  });

  const [errors, setErrors] = useState({
    Name: '',
    Email: '',
    Message: '',
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle form input changes
  const handleChange = (e) => {
    setContact({
      ...contact,
      [e.target.name]: e.target.value,
    });
  };

  // Simple email validation
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validation function
  const validateForm = () => {
    let formIsValid = true;
    const newErrors = { Name: '', Email: '', Message: '' };

    // Validate Name
    if (!contact.Name) {
      newErrors.Name = 'Name is required.';
      formIsValid = false;
    }

    // Validate Email
    if (!contact.Email) {
      newErrors.Email = 'Email is required.';
      formIsValid = false;
    } else if (!validateEmail(contact.Email)) {
      newErrors.Email = 'Please enter a valid email address.';
      formIsValid = false;
    }

    // Validate Message
    if (!contact.Message) {
      newErrors.Message = 'Message is required.';
      formIsValid = false;
    }

    setErrors(newErrors);
    return formIsValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return; // Don't submit if form is invalid
    }

    // Send contact data to backend
    axios.post(`${API_BASE_URL}/user/contact`, contact)
      .then((res) => {
        alert(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("There was an error submitting the form.");
      });
  };

  useEffect(() => {
    axios.get(`${API_BASE_URL}/admin/viewreviews`)
      .then((res) => {
        const reviewsData = res.data;
        setReviews(reviewsData);
        console.log(reviewsData);
      })
      .catch((err) => {
        console.log(err);
      });

    gsap.fromTo(".header-text", 
      { opacity: 0, y: -100 }, 
      { opacity: 1, y: 0, duration: 1.5, ease: "bounce.out" }
    );

    gsap.fromTo(".about-text", 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1.5, ease: "power2.out", stagger: 0.1 }
    );

    gsap.fromTo(".testimonial-box", 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1.5, stagger: 0.2, ease: "power2.out", delay: 1.5 }
    );
  }, []);

  const posted = reviews.filter(review => review.reviewstatus === "posted");

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div>
      <AppBar position="sticky" sx={navbarStyles}>
        <Toolbar>
          <Typography variant="h6">Bike Buddie</Typography>
          {isMobile ? (
            <IconButton color="inherit" edge="end" onClick={handleDrawerToggle} sx={{ ml: 'auto' }}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box ml="auto">
              <Button sx={buttonHoverStyles} href="#about">About</Button>
              <Button sx={buttonHoverStyles} href="#testimonials">Testimonials</Button>
              <Button sx={buttonHoverStyles} href="#contact">Contact</Button>
              <Button sx={buttonHoverStyles} href="login">Login</Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        <List>
          <ListItem button component="a" href="#about" onClick={handleDrawerToggle}>
            <ListItemText primary="About" />
          </ListItem>
          <ListItem button component="a" href="#testimonials" onClick={handleDrawerToggle}>
            <ListItemText primary="Testimonials" />
          </ListItem>
          <ListItem button component="a" href="#contact" onClick={handleDrawerToggle}>
            <ListItemText primary="Contact" />
          </ListItem>
          <ListItem button component="a" href="/Loginpage" onClick={handleDrawerToggle}>
            <ListItemText primary="Login" />
          </ListItem>
        </List>
      </Drawer>

      <motion.div className="header-text">
        <Slider {...sliderSettings}>
          <div>
            <img src={slider1} alt="slider 1" style={{ width: '100%', height: '80vh', objectFit: 'cover' }} />
          </div>
          <div>
            <img src="slider2.jpg" alt="slider 2" style={{ width: '100%', height: '80vh', objectFit: 'fill' }} />
          </div>
        </Slider>
      </motion.div>

      <Container id="about" sx={{ py: 8 }} className="about-text">
        <Typography variant="h4" textAlign="center" mb={3}>About Us</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" mb={2}>About Our Site</Typography>
            <Typography variant="body1">We provide fast and reliable bike taxi services, making transportation more convenient and efficient for everyone.</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" mb={2}>Our Goals & Vision</Typography>
            <Typography variant="body1">Our goal is to revolutionize urban mobility with eco-friendly and affordable bike taxi solutions, ensuring convenience and efficiency for all users.</Typography>
          </Grid>
        </Grid>
      </Container>

      <motion.section id="testimonials">
        <Container>
          <Typography variant="h4" textAlign="center" mb={3}>What Our Customers Say</Typography>
          <Grid container spacing={2} justifyContent="center">
            {posted.length > 0 ? (
              posted.map((review, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box className="testimonial-box">
                    <Avatar src={review.profilePic || defaultAvatar} alt={review.username} />
                    <Box>
                      <Typography variant="h6">{review.username}</Typography>
                      <ReactStars 
                        count={5} 
                        value={review.rating} 
                        size={24} 
                        edit={false}  // Set edit to false to display the stars as a rating
                        color2={'#ff7043'}  // Color of the filled stars
                      />
                       <Typography variant="body2">"{review.userId.fullname}"</Typography>
                      <Typography variant="body2">"{review.review}"</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" textAlign="center">No testimonials available.</Typography>
            )}
          </Grid>
        </Container>
      </motion.section>

      <Container id="contact" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" mb={3}>Contact Us</Typography>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            {/* Contact Form */}
            <form onSubmit={handleSubmit}>
              <TextField 
                fullWidth 
                label="Name" 
                margin="normal" 
                name="Name"
                value={contact.Name}
                onChange={handleChange}
                error={Boolean(errors.Name)}  // Show error if validation fails
                helperText={errors.Name}
              />
              <TextField 
                fullWidth 
                label="Email" 
                margin="normal" 
                name="Email"
                value={contact.Email}
                onChange={handleChange}
                error={Boolean(errors.Email)}  // Show error if validation fails
                helperText={errors.Email}
              />
              <TextField 
                fullWidth 
                label="Message" 
                margin="normal" 
                name="Message"
                value={contact.Message}
                onChange={handleChange}
                multiline
                rows={4}
                error={Boolean(errors.Message)}  // Show error if validation fails
                helperText={errors.Message}
              />
              <Button 
                type="submit" 
                fullWidth 
                sx={buttonStyles1} 
                style={{ marginTop: '10px' }}
              >
                Send Enquiry
              </Button>
            </form>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ backgroundColor: '#333', padding: '1rem' }}>
        <Typography variant="body2" color="white" textAlign="center">© 2025 All Rights Reserved.</Typography>
      </Box>
    </div>
  );
};

export default HomePage;