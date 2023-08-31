const { Schema, model } = require("mongoose");

const daySchema = new Schema (
    {
        name: {
            type :String ,
            required: [true, "Select a date."],
            unique: true
        },
        openedHours: {
            type: Number,
            required: [true, "Select a hour of your service." ]
        },
        date: {
            type: Date,
        },
        reservations: [{
            type: Schema.Types.ObjectId, 
            ref:"Reservation"
        }]
    }
    ,
        {
            timestamps: true ,
        }
)

const Day = model("Day", daySchema);

module.exports = Day;