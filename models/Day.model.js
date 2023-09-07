const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const daySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Select a date."],
        },
        openedHours: {
            type: Number,
            required: [true, "Select an hour for your service."],
        },
        date: {
            type: Date,
        },
        reservations: [
            {
                type: Schema.Types.ObjectId,
                ref: "Reservation",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Day = model("Day", daySchema);

module.exports = Day;
