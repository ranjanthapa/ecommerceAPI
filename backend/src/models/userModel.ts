import mongoose, { model, Schema , Document} from "mongoose";

import * as bcrypt from "bcryptjs";

interface UserDocI extends Document {
  fullName: string;
  email: string;
  contactNumber: string;
  password: string;
  role: string,
  isCorrectPassword: (
    candidatePassword: string,
    password: string
  ) => Promise<boolean>;
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
        default: "user"
    }
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

export const User = model("User", userSchema);

