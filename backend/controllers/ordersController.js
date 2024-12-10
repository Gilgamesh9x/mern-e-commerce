import "express-async-errors";
import Order from "../models/orderModel.js";

// Create new order
export async function addOrderItems(req, res) {
  const { userId } = req.user;
  const { orderItems, shippingAddress, itemsPrice, shippingPrice, totalPrice } =
    req.body;

  const order = await Order.create({
    user: userId,
    orderItems: orderItems.map((item) => {
      return { ...item, product: item._id, _id: null };
    }),
    shippingAddress,
    itemsPrice,
    shippingPrice,
    totalPrice,
    isPaid: false,
    isDelivered: false,
  });

  return res.status(201).json(order);
}

// Get orders
export async function getOrders(req, res) {
  const orders = await Order.find({}).populate("user", "fullName");
  return res.status(200).json(orders);
}

// Get logged in user orders
export async function getUserOrders(req, res) {
  const { userId } = req.user;
  const orders = await Order.find({ user: userId });
  return res.status(200).json(orders);
}

// Get order by id
export async function getOrderById(req, res) {
  const { orderId } = req.params;
  const order = await Order.findById(orderId).populate(
    "user",
    "fullName email"
  );
  return res.status(200).json(order);
}

// Update order to paid
export async function updateOrderToPaid(req, res) {
  const { orderId } = req.params;
  const updatedOrder = await Order.findOneAndUpdate(
    { _id: orderId },
    {
      isPaid: true,
      paidAt: Date.now(),
      paymentResult: {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      },
    },
    { new: true }
  );

  return res.status(200).json(updatedOrder);
}

// Update isDelivered
export async function updateIsDelivered(req, res) {
  const { orderId } = req.params;
  const updatedOrder = await Order.findOneAndUpdate(
    { _id: orderId },
    {
      isDelivered: true,
      deliveredAt: new Date(),
    },
    { new: true }
  );
  return res.status(200).json(updatedOrder);
}
