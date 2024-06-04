const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    required: true,
  },
  phone: {
    type: String,
    minlength: 5,
  },
  street: {
    type: String,
    minlength: 5,
    required: true,
  },
  city : {
    type: String,
    minlength: 3,
    required: true,
  },
})

module.exports = mongoose.model("Person", schema)