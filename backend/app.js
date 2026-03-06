const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");

// --- IMPORT CÁC ROUTE ---
const authRouter = require("./app/routes/auth.route");
const breedRouter = require("./app/routes/breed.route");
const dogRouter = require("./app/routes/dog.route");
const farmRouter = require("./app/routes/farm.route");
const customerRouter = require("./app/routes/customer.route");


const app = express();

app.use(cors());
app.use(express.json());
// Cấp quyền truy cập công khai cho thư mục uploads
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to PetShop application." });
});

// --- ĐĂNG KÝ CÁC ROUTE ---
app.use("/api/auth", authRouter);
app.use("/api/breeds", breedRouter);
app.use("/api/dogs", dogRouter);
app.use("/api/farms", farmRouter);
app.use("/api/customers", customerRouter);


// --- XỬ LÝ LỖI ---
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});


module.exports = app;