import { useState, useEffect } from 'react';
import { Container, TextField, Button, ToggleButton, ToggleButtonGroup, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Reg.css';
import { ToastContainer, toast, Bounce } from 'react-toastify';
const FormContainer = styled(motion.div)({
    maxWidth: '400px',
    margin: 'auto',
    padding: '2rem',
    background: '#ffffff',
    borderRadius: '15px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
});

const RegisterPage = () => {
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState(null);
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [remainingTime, setRemainingTime] = useState(60); // Track remaining time for OTP expiry

    const [fullnameError, setFullnameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const navigate = useNavigate();

    // Start a timer for OTP expiration
    useEffect(() => {
        let timer;
        if (isOtpSent && remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime((prev) => prev - 1);
            }, 1000);
        }

        // Clear timer when OTP expires or the user navigates away
        return () => clearInterval(timer);
    }, [isOtpSent, remainingTime]);

    const handleToggle = (event, newRole) => {
        if (newRole !== null) {
            setRole(newRole);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Reset previous errors
        setFullnameError('');
        setEmailError('');
        setPasswordError('');
        setOtpError('');
        setError(null);

        // Validate fields
        let valid = true;

        // Full name validation
        if (!fullname) {
            setFullnameError('Full Name is required.');
            valid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setEmailError('Please enter a valid email address.');
            valid = false;
        }

        // Password validation
        if (!password) {
            setPasswordError('Password is required.');
            valid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            valid = false;
        }

        if (!valid) return; // Stop submission if validation fails

        const payload = { email, password, role, fullname };
        const url = `${API_BASE_URL}/user/register`;

        try {
            const res = await axios.post(url, payload);
            alert(res.data.message);

            if (!res.data.error) {
                setIsOtpSent(true); // OTP sent after successful registration
                setRemainingTime(60); // Reset the timer to 60 seconds
            }

            localStorage.setItem("email", email);
            setEmail('');
            setPassword('');
            setFullName('');
            setRole('user');
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong!');
        }
    };

    const handleOtpSubmit = async () => {
        const email = localStorage.getItem('email');

        // OTP validation
        if (!otp) {
            setOtpError('OTP is required.');
            return;
        } else if (isNaN(otp)) {
            setOtpError('OTP must be a number.');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/user/verify-otp`, { email, otp });
            toast.success('OTP send your email!')
            // alert(response.data.message);
            navigate('/login');
        } catch (error) {
            toast.error('OTP verification failed!');
            // alert(error.response?.data?.message || 'OTP verification failed!');
        }
    };

    const handleResendOtp = async () => {
        const email = localStorage.getItem('email');
        try {
            const response = await axios.post(`${API_BASE_URL}/user/resend-otp`, { email });
            alert(response.data.message);
            setRemainingTime(60); // Reset the timer to 60 seconds
            setIsOtpSent(true); // OTP sent again
        } catch (error) {
            toast.error('Failed to resend OTP!');
            // alert(error.response?.data?.message || 'Failed to resend OTP!');
        }
    };

    return (
        <div className="Reg-page">
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
            <Container>
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
                        <FormContainer whileHover={{ scale: 1.02 }}>
                            <Typography variant="h5" textAlign="center" mb={2} fontWeight={600}>Register</Typography>

                            {/* Full Name Field */}
                            <TextField
                                fullWidth
                                label="Full Name"
                                margin="normal"
                                required
                                value={fullname}
                                onChange={(e) => setFullName(e.target.value)}
                                error={!!fullnameError}
                                helperText={fullnameError}
                            />

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

                            {/* Role Toggle */}
                            <ToggleButtonGroup
                                value={role}
                                exclusive
                                onChange={handleToggle}
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                <ToggleButton value="user">User</ToggleButton>
                                <ToggleButton value="rider">Rider</ToggleButton>
                            </ToggleButtonGroup>

                            {error && <Typography color="error" variant="body2" textAlign="center" mt={2}>{error}</Typography>}

                            {/* OTP Field (Only displayed if OTP is sent) */}
                            {isOtpSent && (
                                <>
                                    <TextField
                                        fullWidth
                                        label="Enter OTP"
                                        margin="normal"
                                        type="text"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        error={!!otpError}
                                        helperText={otpError}
                                    />
                                    <motion.div whileTap={{ scale: 0.9 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            sx={{ mt: 2 }}
                                            onClick={handleOtpSubmit}
                                        >
                                            Verify OTP
                                        </Button>
                                    </motion.div>

                                    {/* Display Resend OTP button if time expires */}
                                    {remainingTime === 0 && (
                                        <motion.div whileTap={{ scale: 0.9 }}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color="secondary"
                                                sx={{ mt: 2 }}
                                                onClick={handleResendOtp}
                                            >
                                                Resend OTP
                                            </Button>
                                        </motion.div>
                                    )}

                                    {/* Display remaining time for OTP expiry */}
                                    {remainingTime > 0 && (
                                        <Typography variant="body2" color="textSecondary" textAlign="center" mt={2}>
                                            OTP expires in {remainingTime} seconds
                                        </Typography>
                                    )}
                                </>
                            )}

                            {/* Register Button */}
                            <motion.div whileTap={{ scale: 0.9 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    onClick={handleSubmit}
                                >
                                    Register
                                </Button>
                            </motion.div>

                            <Typography variant="body2" textAlign="center" mt={2}>
                                Already have an account? <Button variant="text" href="/login">Login</Button>
                            </Typography>
                        </FormContainer>
                    </motion.div>
                </Box>
            </Container>
        </div>
    );
};

export default RegisterPage;
