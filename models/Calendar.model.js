const { Schema, model } = require("mongoose");

const calendarSchema = new Schema (
    {
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