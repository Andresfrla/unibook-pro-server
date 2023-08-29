const { Schema, model } = require("mongoose");

const reservationSchema = new Schema (
    {
        dayInfo: {
            type :String ,
            require: [true, "Select a date."],
            unique: true
            },
        hour: {
                type: Number,
                require: [true, "Select a hour of your service." ]
            },
        duration: {
            type: Number,
            required: [true, "The duration of the service it is required"]
        },
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