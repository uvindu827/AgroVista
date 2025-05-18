import Order from "../models/order.js";
import Product from "../models/product.js";
import { isItFarmer, isItBuyer } from "./userController.js";
import Notification from "../models/notification.js";

export async function createOrder(req, res) {
  try {
    const latestOrder = await Order.find().sort({ orderId: -1 }).limit(1);

    let orderId;
    if (latestOrder.length === 0) {
      orderId = "ORD0001";
    } else {
      const currentOrderId = latestOrder[0].orderId;
      const numberString = currentOrderId.replace("ORD", "");
      const number = parseInt(numberString);
      const newNumber = (number + 1).toString().padStart(4, "0");
      orderId = "ORD" + newNumber;
    }

    const newOrderData = req.body;
    const newProductArray = [];
    let totalAmount = 0;

    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      const product = await Product.findOne({
        key: newOrderData.orderedItems[i].key,
      });

      if (!product) {
        return res.json({
          message: `Product with id ${newOrderData.orderedItems[i].key} not found`,
        });
      }

      const quantity = newOrderData.orderedItems[i].qty;

      newProductArray.push({
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image[0],
      });

      totalAmount += product.price * quantity;
    }

    newOrderData.orderedItems = newProductArray;
    newOrderData.orderId = orderId;
    newOrderData.email = req.user.email;
    newOrderData.isApproved = false;
    newOrderData.status = "Pending";
    newOrderData.totalAmount = totalAmount;
    newOrderData.orderDate = new Date();

    const order = new Order(newOrderData);
    const savedOrder = await order.save();

    res.json({
      message: "Order created",
      order: JSON.parse(JSON.stringify(savedOrder)), // Ensure the order is serialized properly
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function getOrders(req, res) {
  try {
    if (isItBuyer(req)) {
      const orders = await Order.find({ email: req.user.email });

      res.json(orders);
      return;
    } else if (isItFarmer(req)) {
      const orders = await Order.find({});

      res.json(orders);
      return;
    } else {
      res.json({
        message: "Please login to view orders",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function getQuote(req, res) {
  try {
    const newOrderData = req.body;
    const newProductArray = [];

    let total = 0;
    let labeledTotal = 0;

    console.log(req.body);

    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      const product = await Product.findOne({
        key: newOrderData.orderedItems[i].key, // corrected from productId to key
      });

      if (!product) {
        return res.json({
          message: `Product with Key ${newOrderData.orderedItems[i].key} not found`,
        });
      }

      labeledTotal += product.price * newOrderData.orderedItems[i].qty; // labeledPrice should be product.price
      total += product.price * newOrderData.orderedItems[i].qty; // using product.price for both labeled and total

      newProductArray.push({
        name: product.name, // corrected from product.productName to product.name
        price: product.price, // corrected from product.lastPrice to product.price
        labeledPrice: product.price, // using the correct price here
        quantity: newOrderData.orderedItems[i].qty,
        image: product.image[0], // Corrected image field
      });
    }

    console.log(newProductArray);

    newOrderData.orderedItems = newProductArray;
    newOrderData.total = total;

    res.json({
      orderedItems: newProductArray,
      total: total,
      labeledTotal: labeledTotal,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function updateOrder(req, res) {
  if (!isItFarmer(req)) {
    return res.json({
      message: "Please login as farmer to update orders", // Corrected message
    });
  }

  try {
    const orderId = req.params.orderId;

    // Find the order by orderId
    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Get the updated status and notes from the request body
    const { notes, status } = req.body;

    // Update the order with new notes and status
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: orderId },
      { notes, status },
      { new: true }
    );

    // Send notification to buyer if status is Accepted or Declined
    if (status === "Accepted" || status === "Declined") {
      const message = `Your order ${orderId} has been ${status.toLowerCase()} by the farmer.`;
      const notification = new Notification({
        recipientEmail: order.email,
        message: message,
      });
      await notification.save();
    }

    res.json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
