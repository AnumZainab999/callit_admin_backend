const Order = require("../models/Order");

exports.getAllOrders = async (req, res) => {
  try {
   const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 50;
const skip = (page - 1) * limit;


    const paymentStatus = req.query.paymentStatus;

    // Build filter query
    let query = {};
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Get total count of orders
    const total = await Order.countDocuments(query);

    // Fetch paginated orders
    const orders = await Order.find(query)
      .sort({ dateCreated: -1 })
      .skip(skip)
      .limit(limit);

    // Pagination info
    const totalPages = Math.ceil(total / limit);

    // Calculate ticket counts per eventDay
    const eventDayCountsAgg = await Order.aggregate([
      { $match: query },
      { $unwind: "$ticketsPurchased" },
      { 
        $group: {
          _id: "$ticketsPurchased.eventDay",
          count: { $sum: "$ticketsPurchased.quantity" }
        }
      }
    ]);

    // Transform aggregation result into a simpler object
    const eventDayCounts = {};
    eventDayCountsAgg.forEach(item => {
      eventDayCounts[item._id] = item.count;
    });

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
      orders,
      eventDayCounts
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
