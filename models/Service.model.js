const { Schema, model } = require("mongoose");

const serviceSchema = new Schema (
    {
       image: {
        type: String,
        require: [true, "The description of the service is require"]
       },
       service: {
        type :String ,
        require: [true, "The name is required."],
        unique: true
        },
        description: {
            type: String,
            require: [true, "The description is require." ]
           },
       price: {
        type: Number,
        require: [true, "The price is require." ]
       },

    }
)

const Service = model("Service", serviceSchema);

module.exports = Service;
