const { Schema, model } = require("mongoose");

const serviceSchema = new Schema (
    {
        image: {
            type: String,
            required: [true, "The description of the service is require"]
        },
        name: {
            type :String ,
            required: [true, "The name is required."],
            unique: true
        },
        description: {
            type: String,
            required: [true, "The description is require." ]
        },
        price: {
            type: Number,
            required: [true, "The price is require." ]
        },
        duration: {
            type: Number,
            required: [true, "The duration of the service is require."]
        }
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`
        timestamps: true,
      }
)

const Service = model("Service", serviceSchema);

module.exports = Service;
