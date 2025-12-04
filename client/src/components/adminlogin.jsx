import { useState } from 'react';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';

// Styled form container
const FormContainer = styled(motion.div)({
    maxWidth: '400px',
    margin: 'auto',
    padding: '2rem',
    background: '#ffffff',
    borderRadius: '15px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
});

const AdminLoginPage = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Reset previous errors
        setEmailError('');
        setPasswordError('');
        setError(null);

        // Validate email and password
        let valid = true;

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setEmailError('Please enter a valid email address.');
            valid = false;
        }

        // Password validation
        if (!password) {
            setPasswordError('Password cannot be empty.');
            valid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            valid = false;
        }

        if (!valid) {
            return; // Stop submission if validation fails
        }

        const payload = { email, password };
        const url = `${API_BASE_URL}/api/user/login`;

        try {
            const res = await axios.post(url, payload);
            console.log(res.data);
            const response = res.data;
            localStorage.setItem("id", response.user._id);
            if (response.user.role === "rider") {
                toast.success('Login Success! Welcome rider..', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                // alert("Login successful! Welcome rider.");
                navigate("/rider");
            } else if (response.user.role === "user") {
                toast.success('Login Success! Welcome User.', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                // alert("Login successful! Welcome user.");
                navigate("/user/bookride");
            } else if (response.user.role === "admin") {
                toast.success('Login Success! Welcome Admin.', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                // alert("Login successful! Welcome admin.");
                navigate("/admin");
            }
        } catch (error) {
            toast.error('Something went Wrong!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            // setError('Something went wrong!');
            console.log(error);
        }
    };

    return (
        <div>
            <ToastContainer />
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
                        <FormContainer whileHover={{ scale: 1.02 }}>
                            <Typography variant="h5" textAlign="center" mb={2} fontWeight={600}>Login</Typography>

                            {/* Email Field */}
                            <TextField
                                fullWidth
                                label="Email"
                                margin="normal"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!emailError}
                                helperText={emailError}
                            />

                            {/* Password Field */}
                            <TextField
                                fullWidth
                                label="Password"
                                margin="normal"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!passwordError}
                                helperText={passwordError}
                            />

                            {/* General error */}
                            {error && <Typography color="error" variant="body2" textAlign="center" mt={2}>{error}</Typography>}

                            <motion.div whileTap={{ scale: 0.9 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    onClick={handleSubmit}
                                >
                                    Login
                                </Button>
                            </motion.div>

                            <Typography variant="body2" textAlign="center" mt={2}>
                                Don't have an account? <Button variant="text" href="/register">Register</Button>
                            </Typography>
                        </FormContainer>
                    </motion.div>
                </Box>
            </Container>
        </div>
    );
};

export default AdminLoginPage;
