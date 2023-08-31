const { Schema, model } = require("mongoose");

const calendarSchema = new Schema (
    {
        adminId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        days: [{
            type: Schema.Types.ObjectId,
            ref: "Day"
        }]
    }
    ,
        {
            timestamps: true ,
        }
)

const Calendar = model("Calendar", calendarSchema);

module.exports = Calendar;