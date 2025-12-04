const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const dbConnect = require('./models/dbconnect');
require('dotenv').config();

app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Connect to Database
dbConnect();

// ✅ Import Routers
const paymentRouter = require('./router/paymentRouter');
const userRouter = require('./router/userRouter');
const riderRouter = require('./router/riderRouter');
const adminRouter = require('./router/adminRouter');

// ✅ Use Routers
app.use('/api/payment', paymentRouter);
app.use('/api/user', userRouter);
app.use('/api/rider', riderRouter);
app.use('/api/admin', adminRouter);

// ✅ Server Listening
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT} sucessfully`);
});
