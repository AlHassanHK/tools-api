const { findById } = require("../models/ordersModel");
const orders = require("../models/ordersModel");
const APIFeatures = require("../utils/apiFeatures");
const Email = require("../utils/email");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const axios = require("axios");

exports.getAll = async (req, res) => {
  try {
    const features = new APIFeatures(orders.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const allOrders = await features.query;

    res.status(200).json({
      status: "success",
      data: {
        allOrders,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.provideEmailAndName = async (req, res) => {
  try {
    const { email, name } = req.body;
    // TODO: will we implement the frontend to provide the path
    await new Email(email, name, "/").sendWelcome();

    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.createOrder = async (req, res) => {
  //won't take status, check that item exists and is in stock in the other service
  try {
    const newOrder = await orders.create(req.body);
    res.status(201).json({
      status: "Successfully created order.",
      data: { newOrder },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request.",
      data: {},
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const updateOrder = await orders.findByIdAndUpdate(
      req.params.id,
      req.body,
      { runValidators: true }
    );

    res.status(200).json({
      status: "Successfully updated product.",
      data: { updateOrder },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      data: {},
    });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const cancelledOrder = await orders.findById(req.params.id);

    if (!cancelledOrder) throw new Error("no order with this id");

    cancelledOrder.orderStatus = "cancelled";

    await orders.save();

    res.status(200).json({
      status: "Successfully cancelled order",
      data: {
        cancelledOrder,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.getOrder = async (req, res) =>{
  try {
    const order = await orders.findById(req.params.id);
    res.status(200).json({
      data: order
    });
  } catch (error) {
    res.status(400).json({
      status:"Bad request."
    });
  }
};

exports.getOrderStatus = async (req, res) => {
  try {
    const orderStatus = await orders
      .findById(req.params.id)
      .select("orderStatus");
    res.status(200).json({
      orderStatus,
    });
  } catch (error) {
    res.status(400).json({ status: "Bad request." });
  }
};

exports.checkoutSession = async (req, res) => {
  try {
    const order = await orders.findById(req.params.orderId);
    if (!order) throw new Error()
    const totalCount = order.items.reduce(
      (sum, item) => sum + item.itemCount,
      0
    );

     const ids = order.items.map((item) => item.itemId);
          
    const names = ids.map(async (item) =>{
      const data  = await axios.get(
        `https://inventory-service.vercel.app/api/v1/products/${item}`
      );
      return pro = data.data.data.name
      
    })
    let nn = ''
    const values = await Promise.all(names)
    nn = values.join(' and ')
    
   
   
   const price = ids.map(async (item) =>{
    const data  = await axios.get(
      `https://inventory-service.vercel.app/api/v1/products/${item}`
    );
    return pro = data.data.data.price
  })
  const valPrice = await Promise.all(price)
  
  const gg = valPrice.reduce(
    (sum, item) => sum + +item,
    0
  );
  const pp = gg*100

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: "http://localhost:3000/buy=true",
      cancel_url: "http://localhost:3000/",
      customer_email: "a.abdo.mae@gmail.com", 
      client_reference_id: req.params.orderId,
      line_items: [
        {
          name: `${nn}`,
          amount: `${pp}`,
          currency: "egp",
          quantity: `1`,
        },
      ],
    });

    res.status(200).json({
      status: "success",
      session,
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
};