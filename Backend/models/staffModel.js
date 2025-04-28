import mongoose from "mongoose";

// Create a counter schema to track the employee ID
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const staffSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  basicSalary: {
    type: Number,
    required: true,
    min: [0, 'Basic salary cannot be negative']
  }
});

// Pre-save hook to auto-increment and format employee ID
staffSchema.pre('save', async function(next) {
  const doc = this;
  
  // Only generate employeeId when document is new
  if (doc.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'employeeId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      
      // Format the employee ID as EMP followed by padded number (EMP01, EMP02, etc.)
      const paddedCounter = counter.seq.toString().padStart(2, '0');
      doc.employeeId = `EMP${paddedCounter}`;
      
      next();
    } catch (error) {
      return next(error);
    }
  } else {
    next();

  }
});

const Staff = mongoose.model("staff", staffSchema);

export default Staff;