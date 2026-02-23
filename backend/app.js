const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");

// --- IMPORT CÁC ROUTE ---
const authRouter = require("./app/routes/auth.route");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to PetShop application." });
});

// --- ĐĂNG KÝ CÁC ROUTE ---
app.use("/api/auth", authRouter);

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