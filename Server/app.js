const express = require("express");
const connectDB = require("./config/database");
var cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");



// importing routes
const userRoutes = require("./routes/userRouter");
const productRoutes = require("./routes/productRouter");
const reviewRoutes = require("./routes/reviewRouter");
const orderRoutes = require("./routes/orderRouter");
const cartRoutes = require("./routes/cartRouter");
const authRoutes = require("./routes/authRouter");
const categoryRoutes = require("./routes/categoryRouter");
const giftsRoutes = require("./routes/giftsRouter");
const uploadRoutes = require("./routes/uploadRouter");
const wishlistRoutes = require("./routes/wishlistRouter");
const adminDashboardRoutes = require("./routes/adminDashboardRouter");
const promotionRouter= require("./routes/promotionRouter")
const settingsRoutes = require("./routes/settingsRouter");
const chatRoutes =require("./routes/chatRoutes")

//.env file
dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));
app.use(bodyParser.json());
app.use(express.json());
app.use(
    express.urlencoded({ extended: true })
);
app.use(cookieParser());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));


//routes
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/gifts", giftsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/promotions", promotionRouter);
app.use("/api/settings", settingsRoutes);
app.use("/api/chat", chatRoutes);


//Global error handling
app.use((err,req, res, next) => {
    res.status(400).json({err});
});

// swager Call


//db connection
connectDB();

module.exports = app;
