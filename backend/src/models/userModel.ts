import mongoose, { model, Schema, Document } from "mongoose";

import * as bcrypt from "bcryptjs";

interface UserDocI extends Document {
  fullName: string;
  email: string;
  contactNumber: string;
  password: string;
  role: string;
  isCorrectPassword: (
    candidatePassword: string,
    password: string
  ) => Promise<boolean>;

  changePasswordAfter: (jwtTimeStamp: number) => boolean;
}

const userSchema = new Schema<UserDocI>(
  {
    fullName: String,
    email: {
      type: String,
      require: [true, "An email required"],
    },
    contactNumber: String,
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.isCorrectPassword = async function (
  candidatePassword: string,
  password: string
) {
  return await bcrypt.compare(candidatePassword, password);
};

userSchema.methods.changePasswordAfter = function (jwtTimeStamp: number) {
  if (this.updatedAt) {
    const changeTimeStamp = Math.floor(this.updatedAt.getTime() / 1000);
    console.log("CHange timeStamp type", typeof(changeTimeStamp))

    return jwtTimeStamp < changeTimeStamp; 
  }
};

export const User = model("User", userSchema);
