const { Schema, model } = require("mongoose");

const reservationSchema = new Schema (
    {
        dayInfo: {
            type :String ,
            required: [true, "Select a date."],
            unique: true
        },
        hours: {
            type: Number,
            required: [true, "Select a hour of your service." ]
        },
        services: [{
            type: Schema.Types.ObjectId,
            ref: "Service"
        }],
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    }
    ,
        {
            timestamps: true ,
        }
)

const Reservation = model("Reservation", reservationSchema);

module.exports = Reservation;