import mongoose from "mongoose";  // Import mongoose

const nameValidator = (value) => /^[a-zA-Z\s]+$/.test(value);
const contactNumberValidator = (value) => /^[0-9]{10}$/.test(value);

const cOrderSchema = new mongoose.Schema({
  customerName: { 
    type: String, 
    required: true, 
    validate: [nameValidator, 'Customer name can only contain letters and spaces'] 
  },
  customerAddress: { type: String, required: true },
  customerContactNumber: { 
    type: String, 
    required: true, 
    validate: [contactNumberValidator, 'Contact number must be 10 digits long and contain only numbers'] 
  },
  customerEmail: { 
    type: String, 
    required: true, 
    validate: {
      validator: function(value) {
        return /\S+@\S+\.\S+/.test(value);  // Basic email validation
      },
      message: "Please provide a valid email address"
    }
  },
  paymentOption: { type: String, required: true },
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
  totalAmount: { type: Number, required: true },
  orderDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return value >= threeMonthsAgo && value <= new Date();
      },
      message: "Order date must be within the last 3 months and not in the future."
    }
  }
}, { timestamps: true });

const cOrder = mongoose.model("customerOrder", cOrderSchema);
export default cOrder;
