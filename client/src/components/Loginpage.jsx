// import { useState } from 'react';
// import { Container, TextField, Button, Box, Typography } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { motion } from 'framer-motion';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// // Styled form container
// const FormContainer = styled(motion.div)({
//     maxWidth: '400px',
//     margin: 'auto',
//     padding: '2rem',
//     background: '#ffffff',
//     borderRadius: '15px',
//     boxShadow: '0 8px 20px rgba(0,0,0,0.2)', 
// });

// const LoginPage = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState(null);
//     const [emailError, setEmailError] = useState('');
//     const [passwordError, setPasswordError] = useState('');
//     const navigate = useNavigate();

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         // Reset previous errors
//         setEmailError('');
//         setPasswordError('');
//         setError(null);

//         // Validate email and password
//         let valid = true;

//         // Email validation
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!email || !emailRegex.test(email)) {
//             setEmailError('Please enter a valid email address.');
//             valid = false;
//         }

//         // Password validation
//         if (!password) {
//             setPasswordError('Password cannot be empty.');
//             valid = false;
//         } else if (password.length < 6) {
//             setPasswordError('Password must be at least 6 characters long.');
//             valid = false;
//         }

//         if (!valid) {
//             return; // Stop submission if validation fails
//         }

//         const payload = { email, password };
//         const url = 'http://localhost:9000/user/login';

//         try {
//             const res = await axios.post(url, payload);
//             console.log(res.data);
//             const response = res.data;
//             localStorage.setItem("id", response.user._id);
//             if (response.user.role === "rider") {
//                 alert("Login successful! Welcome rider.");
//                 navigate("/rider");
//             } else if (response.user.role === "user") {
//                 alert("Login successful! Welcome user.");
//                 navigate("/user/bookride");
//             } else if (response.user.role === "admin") {
//                 alert("Login successful! Welcome admin.");
//                 navigate("/admin");
//             }
//         } catch (error) {
//             setError('Something went wrong!');
//             console.log(error);
//         }
//     };

//     return (
//         <Container>
//             <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
//                 <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
//                     <FormContainer whileHover={{ scale: 1.02 }}>
//                         <Typography variant="h5" textAlign="center" mb={2} fontWeight={600}>Login</Typography>

//                         {/* Email Field */}
//                         <TextField
//                             fullWidth
//                             label="Email"
//                             margin="normal"
//                             type="email"
//                             required
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             error={!!emailError}
//                             helperText={emailError}
//                         />

//                         {/* Password Field */}
//                         <TextField
//                             fullWidth
//                             label="Password"
//                             margin="normal"
//                             type="password"
//                             required
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             error={!!passwordError}
//                             helperText={passwordError}
//                         />

//                         {/* General error */}
//                         {error && <Typography color="error" variant="body2" textAlign="center" mt={2}>{error}</Typography>}

//                         <motion.div whileTap={{ scale: 0.9 }}>
//                             <Button
//                                 fullWidth
//                                 variant="contained"
//                                 color="primary"
//                                 sx={{ mt: 2 }}
//                                 onClick={handleSubmit}
//                             >
//                                 Login
//                             </Button>
//                         </motion.div>

//                         <Typography variant="body2" textAlign="center" mt={2}>
//                             Don't have an account? <Button variant="text" href="/register">Register</Button>
//                         </Typography>
//                     </FormContainer>
//                 </motion.div>
//             </Box>
//         </Container>
//     );
// };

// export default LoginPage;


import { useState } from 'react';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
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

const LoginPage = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(null);
    const [emailError, setEmailError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false); // State to toggle between email and OTP input
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isOtpSent) {
            // Step 1: Send OTP to email
            setEmailError('');
            setError(null);

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                setEmailError('Please enter a valid email address.');
                return;
            }

            // Send OTP to the email
            try {
                const res = await axios.post(`${API_BASE_URL}/user/login`, { email });
                console.log(res.data);
                if (res.data) {
                    setIsOtpSent(true);
                    toast.success('OTP Sent to mail address')
                    // alert("OTP sent to your email address.");
                }
            } catch (error) {
                setError('Failed to send OTP. Please try again later.');
                console.log(error);
            }
        } else {
            // Step 2: Verify OTP and login
            setOtpError('');
            setError(null);

            if (!otp) {
                setOtpError('OTP cannot be empty.');
                return;
            }

            try {
                const res = await axios.post(`${API_BASE_URL}/user/verify-otplogin`, { email, otp });
                if (res.data) {
                    console.log(res.data);
                    localStorage.setItem("id", res.data.user._id);
                    if (res.data.user.role === "rider") {
                        toast.success('Login Success! Welcome rider')
                        // alert("Login successful! Welcome rider.");
                        setTimeout(() => {
                            navigate('/rider');  // Replace with your desired route
                        }, 1500);
                    } else if (res.data.user.role === "user") {
                        toast.success('Login success! Welcome User')
                        // alert("Login successful! Welcome user.");
                        setTimeout(() => {
                            navigate('/user/bookride');  // Replace with your desired route
                        }, 1500);
                    } else if (res.data.user.role === "admin") {
                        toast.success('Login success! Welcome Admin')
                        // alert("Login successful! Welcome admin.");
                        setTimeout(() => {
                            navigate('/admin');  // Replace with your desired route
                        }, 1500);
                    }
                } else {
                    setError('Invalid OTP. Please try again.');
                }
            } catch (error) {
                toast.error('Something went Wrong! Please try again later.')
                // setError('Something went wrong! Please try again later.');
                console.log(error);
            }
        }
    };

    return (
        <div className='log-page'>
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
                            <Typography variant="h5" textAlign="center" mb={2} fontWeight={600}>Login</Typography>

                            {/* Step 1: Email Field */}
                            {!isOtpSent && (
                                <div className='box'>
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
                                </div>
                            )}

                            {/* Step 2: OTP Field */}
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
                                </>
                            )}

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
                                    {isOtpSent ? 'Verify OTP' : 'Send OTP'}
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

export default LoginPage;
