const express = require("express");
const router = express.Router();
const {
    getAdminTopProducts,
    getOrderByYear,
    getOrderStatsByStatus,
    getNumberStat,
    getNewUsers,
    getAdminDashboardStats,
    getFinancialStats,
    getMonthlyRevenueByYear
} = require("../controllers/adminDashboradController");

// Admin dashboard routes

router.get("/top-products", getAdminTopProducts);
router.get("/dashboard-stats", getNumberStat);
router.get("/orders-by-year/:year", getOrderByYear);
router.get("/order-stats-by-status", getOrderStatsByStatus);
router.get("/financial-stats", getFinancialStats);
router.get("/new-users", getNewUsers);

router.get('/monthly-revenue/:year', getMonthlyRevenueByYear);

module.exports = router;
