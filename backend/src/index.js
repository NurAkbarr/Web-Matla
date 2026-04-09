const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());

// Enable Helmet for basic security headers; configure to allow cross-origin images for uploaded files
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const pmbSettingRoutes = require("./routes/pmbSettingRoutes");
const prodiRoutes = require("./routes/prodiRoutes");
const pmbRoutes = require("./routes/pmbRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const studentDashboardRoutes = require("./routes/studentDashboardRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const courseScheduleRoutes = require("./routes/courseScheduleRoutes");
const studentProfileRoutes = require("./routes/studentProfileRoutes");
const dosenRoutes = require("./routes/dosenRoutes");

// Basic Health Check Route
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "Matla Backend API is running" });
});

// Define API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pmb-settings", pmbSettingRoutes);
app.use("/api/prodi", prodiRoutes);
app.use("/api/pmb", pmbRoutes);
app.use("/api/student", studentDashboardRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/course-schedule", courseScheduleRoutes);
app.use("/api/student-profile", studentProfileRoutes);
app.use("/api/dosen", dosenRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
