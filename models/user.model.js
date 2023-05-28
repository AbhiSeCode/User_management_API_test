const { schema, model, Schema } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);

const User = model("User", userSchema);

module.exports = User;
