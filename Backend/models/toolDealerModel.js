import mongoose from 'mongoose';

const toolDealerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    tools: [{
        name: String,
        price: Number,
        quantity: Number,
        description: String
    }],
    createdAt: { type: Date, default: Date.now }
});

const ToolDealer = mongoose.model('ToolDealer', toolDealerSchema);
export default ToolDealer;