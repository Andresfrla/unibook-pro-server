const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required."],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "You date of birth is required."]
    },
    role: {
      type: String,
      enum: ["admin", "client"],
      default: 'client'
    },
    schedule: [{
      type: Schema.Types.ObjectId,
      ref: "Reservation"
    }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
