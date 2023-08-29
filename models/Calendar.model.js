const { Schema, model } = require("mongoose");

const calendarSchema = new Schema (
    {
        dayInfo: {
            type :String ,
            require: [true, "Select a date."],
            unique: true
        },
        hours: {
            type: Number,
            require: [true, "Select a hour of your service." ]
        },
        services: [{
            type: Schema.Types.ObjectId,
            ref: "Service"
        }],
        adminId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        reservations: [{
            type: Schema.Types.ObjectId,
            ref: "Reservation"
        }]
    }
    ,
        {
            timestamps: true ,
        }
)

const Calendar = model("Calendar", calendarSchema);

module.exports = Calendar;