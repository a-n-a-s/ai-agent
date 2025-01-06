import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxLength: [50, "Email cannot exceed 50 characters"],
    minLength: [6, "Email cannot be less than 6 characters"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

UserSchema.statics.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};


UserSchema.statics.comparePassword = async (user_password,password) => {
  
  return await bcrypt.compare(password, user_password);
};

UserSchema.statics.generateJWT = function () {
  return jwt.sign({ email: this.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const UserAI = mongoose.model("User-AI", UserSchema);

export default UserAI;