const Order = require("../models/Order");

exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const paymentStatus = req.query.paymentStatus;

    // Build filter query
    let query = {};
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Get total count
    const total = await Order.countDocuments(query);

    // Fetch orders
    const orders = await Order.find(query)
      .sort({ dateCreated: -1 })
      .skip(skip)
      .limit(limit);

    // Pagination info
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      message: "Orders fetched successfully",
      pagination: {
        currentPage: page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      orders
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
